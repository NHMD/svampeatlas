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
var fs = require('fs');
var shortid = require('shortid');
var models = require('../')
var ObservationImage = models.ObservationImage;
var Observation = models.Observation;
var Promise = require("bluebird");
Promise.promisifyAll(fs);

var nestedQueryParser = require("../nestedQueryParser");
var userTool = require("../userTool")
var moment = require('moment');

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
			
			if(n.model === "User"){
			
				n = userTool.secureUser(n);
			
			} ;
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
			
			return n;
		});
		
	
	}

	
	ObservationImage.findAndCount(query)
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
	catch (handleError(res));
	
};


// Get a single taxon
exports.show = function(req, res) {
	ObservationImage.find({
		where: {
			_id: req.params.id
		} /*,
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
	catch (handleError(res));
};


exports.addImagesToObs = function(req, res) {
	
	return Observation.find({
		where: {
			_id: req.params.id
		},
		include: [{
			model: models.User,
			as: 'PrimaryUser',
			attributes: ['Initialer']
		}]
	}).then(function(obs) {

		var prefix = obs.PrimaryUser.Initialer.toUpperCase() + obs.observationDate.getFullYear() + "-" + obs._id;
		var promises = [];

		_.each(req.files, function(f) {
			var fname = prefix + "_" + shortid.generate();
			promises.push(
				fs.renameAsync(f.path, f.destination + fname + ".jpg")
				.then(function() {
					return ObservationImage.create({
						observation_id: obs._id,
						hide: false,
						name: fname,
						user_id: req.user._id
					})
				})
			)
		})

		return Promise.all(promises)


	}).
	then(function(promises) {
		return res.status(201).json(promises)
	})
		.
	catch (function(err) {
		console.log(err)
		return res.status(500).json(err)
	})

}

// Creates a new taxon in the DB.
exports.create = function(req, res) {

};



// Updates an existing ObservationImage in the DB.
exports.update = function(req, res) {

	return models.sequelize.transaction(function(t) {
		
		return ObservationImage.find({
			where: {
			_id: req.params.id
		}
		
		},{
				transaction: t
			}).then(function(obserVationImage){
			if (!obserVationImage) {
				res.send(404);
			} 
			obserVationImage.set(req.body);
			var imageName = obserVationImage.name;
			return [imageName, obserVationImage.save({
				transaction: t
			})]
		}).spread(function(imageName){
			
			var eventname = (req.body.hide) ? 'Image hidden' : 'Image shown';
			var description = (req.body.hide) ? ' was hidden from the taxon page.' : ' is shown on the taxon page.';
			return  models.ObservationLog.create({eventname: eventname, description: imageName+description, user_id: req.user._id, observation_id: req.params.id}, {transaction: t})
		})
	})
	.then(function(){
			return res.send(200);
			})
	
		.
	catch(function(err) {
		var statusCode = (err === 'Forbidden') ? 403 : 500;
		console.log(err);
		
		res.status(statusCode).send(err);
	});


	
};


// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
	var userIsValidator = userTool.hasRole(req.user, 'validator');

	return models.sequelize.transaction(function(t) {
		
		return ObservationImage.find({
			where: {
			_id: req.params.id
		}
		
		},{
				transaction: t
			}).then(function(obserVationImage){
			if (!obserVationImage) {
				res.send(404);
			} else if(!userIsValidator && !(req.user._id === obserVationImage.user_id && obserVationImage.createdAt > moment().subtract(1, 'weeks'))){
				throw "Forbidden"
			}
			var imageName = obserVationImage.name;
			return [imageName, obserVationImage.destroy({
				transaction: t
			})]
		}).spread(function(imageName){
			return  models.ObservationLog.create({eventname: 'Deleted image', description: imageName+' was deleted from this record.', user_id: req.user._id, observation_id: req.params.id}, {transaction: t})
		})
	})
	.then(function(){
			return res.send(204);
			})
	
		.
	catch(function(err) {
		var statusCode = (err === 'Forbidden') ? 403 : 500;
		console.log(err);
		
		res.status(statusCode).send(err);
	});



};


