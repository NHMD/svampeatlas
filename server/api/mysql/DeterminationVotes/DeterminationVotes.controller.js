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
var DeterminationVote = models.DeterminationVote;
var Promise = require("bluebird");
var determinationController = require('../Determination/Determination.controller');

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


	DeterminationVote.findAndCount(query)
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
	DeterminationVote.find({
			where: {
				_id: req.params.id
			}
			/*,
		include: [{
				model: models.TaxonImages,
				as: "images"
			}, {
				model: models.TaxonSpeciesHypothesis,
				as: 'specieshypothesis'
			},
			{
				model: models.Taxon,
				as: "synonyms"
			}, {
				model: models.Taxon,
				as: "Parent"
			}, {
				model: models.Taxon,
				as: "acceptedTaxon"
			}, {
				model: models.TaxonAttributes,
				as: "attributes"
			}, {
				model: models.Naturtype,
				as: 'naturtyper'
			}, {
				model: models.ErnaeringsStrategi,
				as: 'nutritionstrategies'
			}, {
				model: models.TaxonomyTag,
				as: 'tags'
			}

		] */
		})
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.
	catch(handleError(res));
};



exports.addVoteToDetermination = (req, res) => {
	var vote = req.body;
	vote.determination_id = req.params.id;
	vote.user_id = req.user._id;
	return models.sequelize.transaction(function(t) {
			return models.Determination.find({
				where: {
					_id: req.params.id
				},
				include: [{
						model: models.Observation,
						as: "Observation"
					},{
					model: models.Taxon,
					as: 'Taxon',
					include: [ {
						model: models.Taxon,
						as: "acceptedTaxon",
						include: [{
				model: models.TaxonStatistics,
				as: "Statistics"
			}]
					}]
				}],
				transaction: t
			})

			.then(function(det) {

					if (det.user_id === req.user._id) {
						throw new Error("Forbidden");
					}
					vote.observation_id = det.observation_id;

					return [determinationController.getUserBaseImpact(req.user._id, det.Taxon), det];



				})
				.spread(function(userImpact, det) {

					if (vote.upOrDown === 'up') {
						vote.score = parseInt(userImpact);
					}
					if (vote.upOrDown === 'down') {
						vote.score = (0 - parseInt(userImpact));
					}

					if (vote.upOrDown === 'zero') {
						vote.score = 0;
					}

					return [DeterminationVote.insertOrUpdate(vote), det];
				})
				.spread(function(vote, det) {


					return [DeterminationVote.find({
						where: {
							determination_id: det._id,
							user_id: vote.user_id
						}
					}), det, models.DeterminationVote.sum('score', {
						where: {
							determination_id: det._id
						}
					}), 
										
					
					models.DeterminationVote.findAll({
						where: {
							determination_id: det._id
						},
						attributes: [ [models.sequelize.fn('SUM',models.sequelize.fn('ABS', models.sequelize.col('score'))), 'absolutesum']],
						group: ['determination_id']
					}),
					determinationController.getTaxonWeight(det.Taxon, det.Observation, t)];


				})
				.spread(function(vote, det, sum, absSumCalc, taxonWeight) {
					
					
  	var absSum = absSumCalc[0].get({
    plain: true
  }).absolutesum
  
				console.log("####SUM: "+sum)
				console.log("####ABSSUM: "+absSum)
					// extend to use det.baseScore
					det.score = determinationController.getDeterminationScore(sum + det.baseScore, taxonWeight, absSum+ det.baseScore);
					return [det.save({transaction: t}), {
						vote: vote,
						newDeterminationScore: det.score
					}];
				})
		})
		.spread(function(determinationSavePromise, result) {
			return res.status(201).json(result)
		})
		.
	catch((err) => {
		var statusCode = (err.message === 'Forbidden') ? 403 : 500;
		console.log(err);

		res.status(statusCode).send(err.message);
	});
}

function getUserImpact(user, determination) {


	// When testing return a already resolved promise with value 1. This can be extended to DB queries and calculations
	return Promise.resolve(1);
}

exports.getUserImpact = getUserImpact;

// Creates a new taxon in the DB.
exports.create = function(req, res) {

};



// Updates an existing taxon in the DB.
exports.update = function(req, res) {


};


// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
	DeterminationVote.find({
			where: {
				_id: req.params.id
			}
		})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch(handleError(res));
};
