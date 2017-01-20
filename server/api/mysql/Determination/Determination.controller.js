/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /taxons              ->  index
 * POST    /taxons              ->  create
 * GET     /taxons/:id          ->  show
 * PUT     /taxons/:id          ->  update
 * DELETE  /taxons/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

var models = require('../')
var Determination = models.Determination;
var Promise = require("bluebird");
var userTool = require("../userTool");

var nestedQueryParser = require("../nestedQueryParser")

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		console.log(err);
		res.status(statusCode).send(err);
	};
}

function responseWithResult(res, statusCode) {
	statusCode = statusCode || 200;
	return function(entity) {
		if (entity) {
			return res.status(statusCode).json(entity)
		}
	};
}

function handleEntityNotFound(res) {
	return function(entity) {
		if (!entity) {
			res.send(404);
			return null;
		}
		return entity;
	};
}

function saveUpdates(updates) {
	return function(entity) {
		return entity.updateAttributes(updates)
			.then(function(updated) {
				return updated;
			});
	};
}

function removeEntity(res) {
	return function(entity) {
		if (entity) {
			return entity.destroy()
				.then(function() {
					return res.send(204);
				});
		}
	};
}

// Get list of taxons
exports.index = function(req, res) {


	var query = {
		offset: req.query.offset,
		limit: req.query.limit,
		order: req.query.order,
		where: {}
	};



	if (req.query.where) {
		_.merge(query.where, JSON.parse(req.query.where));
	}

	if (req.query.include) {
		var include = JSON.parse(req.query.include)

		query['include'] = _.map(include, function(n) {
			n.model = models[n.model];
			if (n.where) {
				n.where = JSON.parse(n.where);

				if (n.where.$and && n.where.$and.length > 0) {

					for (var i = 0; i < n.where.$and.length; i++) {
						n.where.$and[i] = JSON.parse(n.where.$and[i]);
					}
				}
				/*
				if(n.model === "TaxonomyTag"){

							n.where._id = JSON.parse(n.where._id);
				
				}
				*/

				//	n.where = nestedQueryParser.parseQueryString(n.where)

			}
			console.log(n.where)
			return n;
		});


	}


	Determination.findAndCount(query)
		.then(function(taxon) {
			res.set('count', taxon.count);
			if (req.query.offset) {
				res.set('offset', req.query.offset);
			};
			if (req.query.limit) {
				res.set('limit', req.query.limit);
			};
			return res.status(200).json(taxon.rows)
		})
		.
	catch(handleError(res));

};



// Get a single taxon
exports.show = function(req, res) {
	Determination.find({
			where: {
				_id: req.params.id
			},
			include: [{
				model: models.Taxon,
				as: "Taxon",
				include: [{
					model: models.Taxon,
					as: "acceptedTaxon",
					include: [{
						model: models.TaxonDKnames,
						as: "Vernacularname_DK"
					}]
				}]
			}, {
				model: models.User,
				as: 'User',
				attributes: ['email', 'Initialer', 'name']
			}]
		})
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.
	catch(handleError(res));
};




// Creates a new taxon in the DB.
exports.create = function(req, res) {

};

exports.updateValidation = (req, res) => {


	Determination.find({
		where: {
			_id: req.params.id
		}
	}).then(function(determination) {
		determination.validation = req.body.validation;
		determination.validator_id = req.user._id;
		return determination.save({
			fields: ['validation', 'validator_id']
		})
	}).then(function(determination) {
		return res.status(204).json(determination)
	})
}

exports.addDeterminationToObs = (req, res) => {
	var userIsValidator = userTool.hasRole(req.user, 'validator');
	var determination = req.body;
	determination.observation_id = req.params.id;
	determination.user_id = (determination.user_id) ? determination.user_id : req.user._id;


	console.log(determination)
	models.sequelize.transaction(function(t) {

			return models.Observation.find({
					where: {
						_id: req.params.id
					}
				}, {
					transaction: t
				})
				.then((obs) => {
					return [models.Taxon.find({
						where: {
							_id: determination.taxon_id
						},
						include: [{
							model: models.Taxon,
							as: "acceptedTaxon",
							include: [{
								model: models.TaxonAttributes,
								as: "attributes",
								fields: ['validation']
							}]
						}]
					}, {
						transaction: t
					}), obs]
				})
				.spread((taxon, obs) => {

					if (!obs) {
						res.send(404);
					};
					
					return [getUserBaseImpact(determination.user_id, taxon), taxon, obs]
					
					}).spread((baseScore, taxon, obs) => {
					
					/* Now anybody can add determinations to any observation ???
					
					if (req.user._id !== obs.primaryuser_id && !userIsValidator) {

						throw new Error("Forbidden")
					} */
					
					// TODO: allow validators to submit determinations that is not autovalidated
					if (userIsValidator) {
						determination.validation = "Godkendt";
					} else {
						// If it is the reporters own record and valideringskrav === 0, auto validate, otherwise set to  'Valideres'
						determination.validation = (taxon.acceptedTaxon.attributes.valideringskrav === 0 && determination.user_id === req.user._id) ? 'Godkendt' : 'Valideres';
					} 

					determination.createdByUser = req.user._id;
					determination.score = baseScore;
					determination.baseScore = baseScore;
					
					return [Determination.create(determination, {
						transaction: t
					}), obs]
				}).spread((det, obs) => {
					var update = (userIsValidator || obs.primaryuser_id === req.user._id) ? models.Observation.update({
						primarydetermination_id: det._id
					}, {
						where: {
							_id: req.params.id
						},
						transaction: t
					}) : false;
					return [update, det]
				})

		})
		
		.spread((updated, det) => {

			return models.DeterminationView.find({
				where: {
					Determination_id: det._id
				}
			})

		})
		.then((det) => {
			return res.status(200).json(det);
		})
		.
	catch((err) => {
		var statusCode = (err.message === 'Forbidden') ? 403 : 500;
		console.log(err);

		res.status(statusCode).send(err.message);
	});
}


function getUserBaseImpact(user_id, taxon){
	

	// When testing return a already resolved promise with value 1. This can be extended to DB queries and calculations
	return Promise.resolve(1);
}



// Updates an existing taxon in the DB.
exports.update = function(req, res) {
	Determination.find({
			where: {
				_id: req.params.id
			}
		})
		.then(handleEntityNotFound(res))
		.then(function(det) {
			return det.update(req.body)
		})
		.then(function(det) {
			return res.status(204).json(det)
		})
		.
	catch(handleError(res));

};


// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
	Determination.find({
			where: {
				_id: req.params.id
			}
		})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch(handleError(res));
};
