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
var Observation = models.Observation;
var Promise = require("bluebird");

var nestedQueryParser = require("../nestedQueryParser")

var wktparse = require('wellknown');


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

// Get list of Observations
exports.index = function(req, res) {


	var query = {
		offset: parseInt(req.query.offset),
		limit: parseInt(req.query.limit),
		order: req.query.order,
		where: {}
	};
// 'POLYGON((11.7626589397457 55.5119544279369,11.7631613453886 55.5191206803667,11.7869689746192 55.5185809756286,11.7864622538095 55.5114148669722,11.7626589397457 55.5119544279369))'
	console.log(req.query.geometry)
	if(req.query.geometry){
		query.where = models.sequelize.fn('ST_Contains', models.sequelize.fn('GeomFromText', wktparse.stringify(JSON.parse(req.query.geometry))), models.sequelize.col('geom'))
	}

	if (req.query.where) {
		_.merge(query.where, JSON.parse(req.query.where));
	}

	if (req.query.include) {
		
		var parsed = JSON.parse(req.query.include)
		query['include'] =	_.map(parsed, function(n){
		var n =  JSON.parse(n);
		n.model = models[n.model];
		return n;
		})


	} else {
		query['include'] = [{
				model: models.DeterminationView,
				as: "DeterminationView",
				attributes: ['Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID']
			}, {
				model: models.User,
				as: 'PrimaryUser',
				attributes: ['email', 'Initialer', 'name']
			}, {
				model: models.Locality,
				as: 'Locality'
			}, {
				model: models.ObservationImage,
				as: 'Images',
				separate : true,
				offset:0,
				limit: 10
			}, {
				model: models.ObservationForum,
				as: 'Forum',
				separate : true,
				offset:0,
				limit: 10
				
			}

		] 
	}

	console.log(query);
	Observation.findAndCount(query)
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
	Observation.find({
		where: {
			_id: req.params.id
		},
		include: [{
				model: models.Determination,
				as: "PrimaryDetermination",
				include: [{
					model: models.Taxon,
					as: "Taxon"
				}]
			}, {
				model: models.User,
				as: 'PrimaryUser',
				attributes: ['email', 'Initialer', 'name']
			}, {
				model: models.Locality,
				as: 'Locality'
			}, {
				model: models.ObservationImage,
				as: 'Images'
			}, {
				model: models.ObservationForum,
				as: 'Forum',
				include: [{
						model: models.User,
					as: "User", 
					 fields: ['name']}]
			}

		]
	})
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.
	catch (handleError(res));
};







// Creates a new taxon in the DB.
exports.create = function(req, res) {

};



// Updates an existing taxon in the DB.
exports.update = function(req, res) {

	
};


// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
	Observation.find({
		where: {
			_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch (handleError(res));
};


