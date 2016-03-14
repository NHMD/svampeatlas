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
	
	if(!req.query.limit){
		req.query.limit = 20000;
	}
	if(!req.query.offset){
		req.query.offset = 0;
	}
	var query = {
		offset: parseInt(req.query.offset) ,
		limit: parseInt(req.query.limit),
		where: {}
	};
	if(req.query.order) {
		query.order = req.query.order;
	}

	if(req.query.geometry){
		query.where = models.sequelize.fn('ST_Contains', models.sequelize.fn('GeomFromText', wktparse.stringify(JSON.parse(req.query.geometry))), models.sequelize.col('geom'))
	}

	if (req.query.where) {
		_.merge(query.where, JSON.parse(req.query.where));
	}
	if(req.query.group){
		
		query['group'] =	JSON.parse(req.query.group)
		
	};
	
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
	var activeThreadsPromise;
	if(req.user && Boolean(req.query.activeThreadsOnly) ){
		
		activeThreadsPromise = activeThreads(req.user)
	} else {
		activeThreadsPromise = Promise.resolve(false)
	}
	console.log(query);
	if(query.group === undefined){
	activeThreadsPromise.then(function(observationids){
		if(observationids !== false){
			query.where._id = { $in: observationids}
		};
		
		return Observation.findAndCount(query)
	})
	
		.then(function(taxon) {
			res.set('count', taxon.count);
			if (req.query.offset !== undefined) {
				res.set('offset', req.query.offset);
			};
			if (req.query.limit !== undefined) {
				res.set('limit', req.query.limit);
			};
			return res.status(200).json(taxon.rows)
		})
		.catch (handleError(res));
	} else {
		activeThreadsPromise.then(function(observationids){
			if(observationids !== false){
				query.where._id = { $in: observationids}
			};
			return Observation.findAll(query)
		})
	
		.then(function(taxon) {
			
			if (req.query.offset !== undefined) {
				res.set('offset', req.query.offset);
			};
			if (req.query.limit !== undefined) {
				res.set('limit', req.query.limit);
			};
			return res.status(200).json(taxon)
		})
		.catch (handleError(res));
	}



};

function activeThreads(user){
	
	return models.sequelize.query(
		'select distinct o.observation_id from ObservationForum o JOIN'
		+'(SELECT observation_id, user_id, createdAt FROM ObservationForum WHERE user_id = :userid group by observation_id) a JOIN' 
		+'(SELECT * FROM (SELECT * FROM ObservationForum ORDER BY createdAt DESC) AS s GROUP BY observation_id) b '
		+'ON o.observation_id= a.observation_id AND a.user_id <> b.user_id AND b.observation_id = a.observation_id',
  { replacements: { userid: user._id }, type: models.sequelize.QueryTypes.SELECT }
).then(function(observationids) {
	
	return _.map(observationids, function(o){
		return o.observation_id
	})
 
})
}


// Get a single observation
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
					as: "Taxon",
					include: [{
					model: models.Taxon,
					as: "acceptedTaxon",
						include: [{
							model: models.TaxonDKnames,
							as: "Vernacularname_DK"
						}]
					}]
				},
			    {
			   				model: models.User,
			   				as: 'User',
			   				attributes: ['email', 'Initialer', 'name']
			   			}
			]
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
			},
			{model: models.PlantTaxon,
			as: 'associatedTaxa'
			},
			{model: models.Substrate,
			as: 'Substrate'
			},
			{model: models.VegetationType,
			as: 'VegetationType'
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


