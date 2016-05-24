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
var config = require('../../../config/environment');
var models = require('../')
var Observation = models.Observation;
var Promise = require("bluebird");

var nestedQueryParser = require("../nestedQueryParser")
var userTool = require("../userTool")
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

function cacheResult(req, value){
	var redisClient  = req.redis;
	
	return redisClient.setAsync(req.query.cachekey, value)
	.then(function(){
		return redisClient.expireAsync(req.query.cachekey, config.redisTTL[req.query.cachekey])
	})
	.catch(function(err){
		console.log("error: "+err)
	})
		
}

// Get list of Observations
exports.index = function(req, res) {
	
	if(!req.query.limit){
		req.query.limit = 10000;
	}
	if(!req.query.offset){
		req.query.offset = 0;
	}
	var query = {
		offset: parseInt(req.query.offset) ,
		limit: parseInt(req.query.limit),
		where: {},
		attributes : { exclude: ['noteInternal'] }
	};
	if(req.query.order) {
		query.order = req.query.order;
	}

	if(req.query.geometry){
		query.where = { $and: models.sequelize.fn('ST_Contains', models.sequelize.fn('GeomFromText', wktparse.stringify(JSON.parse(req.query.geometry))), models.sequelize.col('geom'))}
	}

	if (req.query.where) {
		_.merge(query.where, JSON.parse(req.query.where));
	}

	if(req.query.group){
		
		query['group'] =	req.query.group
		
	};
	
	if (req.query.include) {
	
		
		var parsed = JSON.parse(req.query.include)
		query['include'] =	_.map(parsed, function(n){
		var n =  JSON.parse(n);
		
		if(n.model === "User"){
			
			n = userTool.secureUser(n);
			
		} 
		
		// special case for mycokeyattributes included on determinationView
	/*	
		if(n.model === 'DeterminationView' && n.include){
		//	n.include = JSON.parse(n.include);
			for (var i = 0; i < n.include.length; i++){
				n.include[i].model = models[n.include[i].model]
				n.include[i].where = JSON.parse(n.include[i].where)
				
			}
			console.log("###########")
			console.log(n.include)
			console.log("###########")
		}
		*/
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
	if(query.group === undefined && req.query.nocount === undefined){
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
			if(req.query.cachekey) {
				return cacheResult(req, JSON.stringify(taxon)).then(function(){
					return res.status(200).json(taxon)
				})
			} else {
				return res.status(200).json(taxon)
			}
			
		})
		.catch (handleError(res));
	}



};


exports.indexSpeciesList = function(req, res) {
	
	if(!req.query.limit){
		req.query.limit = 10000;
	}
	if(!req.query.offset){
		req.query.offset = 0;
	}

	var query = {
		offset: parseInt(req.query.offset) ,
		limit: parseInt(req.query.limit),
		where: {},
		attributes : [[models.sequelize.fn('count', models.sequelize.col('Observation._id')), 'observationCount']],
		group: "DeterminationView.Taxon_id"
	};
	if(req.query.order) {
		query.order = req.query.order;
	}

	if(req.query.geometry){
		query.where = { $and: models.sequelize.fn('ST_Contains', models.sequelize.fn('GeomFromText', wktparse.stringify(JSON.parse(req.query.geometry))), models.sequelize.col('geom'))}
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
		
		if(n.model === "User"){
			
			n = userTool.secureUser(n);
			
		} 
		
		// special case for mycokeyattributes included on determinationView
	/*	
		if(n.model === 'DeterminationView' && n.include){
		//	n.include = JSON.parse(n.include);
			for (var i = 0; i < n.include.length; i++){
				n.include[i].model = models[n.include[i].model]
				n.include[i].where = JSON.parse(n.include[i].where)
				
			}
			console.log("###########")
			console.log(n.include)
			console.log("###########")
		}
		*/
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

	activeThreadsPromise.then(function(observationids){
		if(observationids !== false){
			query.where._id = { $in: observationids}
		};
		
		return Observation.findAndCount(query)
	})
	
		.then(function(taxon) {
			res.set('count', taxon.count.length);
			if (req.query.offset !== undefined) {
				res.set('offset', req.query.offset);
			};
			if (req.query.limit !== undefined) {
				res.set('limit', req.query.limit);
			};
			return res.status(200).json(taxon.rows)
		})
		.catch (handleError(res));




};




function activeThreads(user){
	
	return models.sequelize.query(
		'select distinct o.observation_id from ObservationForum o JOIN'
		+' (SELECT observation_id, user_id, createdAt FROM ObservationForum WHERE user_id = :userid group by observation_id) a JOIN' 
		+' (SELECT s1.observation_id, s1.user_id, s1.createdAt'
+' FROM ObservationForum s1'
+' LEFT JOIN ObservationForum s2 ON s1.observation_id = s2.observation_id AND s1.createdAt < s2.createdAt'
+' WHERE s2.observation_id IS NULL) b'
		+' ON o.observation_id= a.observation_id AND a.user_id <> b.user_id AND b.observation_id = a.observation_id',
  { replacements: { userid: user._id }, type: models.sequelize.QueryTypes.SELECT }
).then(function(observationids) {
	
	return _.map(observationids, function(o){
		return o.observation_id
	})
 
})
}


// Get a single observation
exports.show = function(req, res) {
	var userIsValidator = (req.user) ? userTool.hasRole(req.user, 'validator') : false;
	
	var query = {
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
			   				attributes: ['_id','email', 'Initialer', 'name']
			   			}
			]
			}, {
				model: models.User,
				as: 'PrimaryUser',
				attributes: ['Initialer', 'name']
			}, {
				model: models.Locality,
				as: 'Locality'
			},
			{
							model: models.GeoNames,
							as: 'GeoNames'
						} ,
			
			{
				model: models.ObservationImage,
				as: 'Images',
				include: [{
					model: models.User,
					as: "Photographer",
				attributes: ['name', 'Initialer']}]
			}, {
				model: models.ObservationForum,
				as: 'Forum',
				include: [{
						model: models.User,
					as: "User", 
					 attributes: ['name', 'Initialer']}]
			},
			{model: models.PlantTaxon,
			as: 'associatedTaxa'
			},
			{model: models.User,
			as: 'users'	,
			attributes: ['_id','email', 'Initialer', 'name']
			},
			{model: models.Substrate,
			as: 'Substrate'
			},
			{model: models.VegetationType,
			as: 'VegetationType'
			}

		]
	};
	
	if(!userIsValidator){
		query.attributes = { exclude: ['noteInternal'] };
	};
	
	Observation.find(query)
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.
	catch (handleError(res));
};






// Creates a new Observation in the DB.
exports.create = function(req, res) {
	var userIsValidator = (req.user) ? userTool.hasRole(req.user, 'validator') : false;
	var determination = req.body.determination;
	var observation = req.body;
	if(!userIsValidator){
		delete observation.noteInternal;
	};
	
	observation.geom = models.sequelize.fn('GeomFromText', 'POINT (' + req.body.decimalLongitude + ' ' + req.body.decimalLatitude + ')');

	return models.sequelize.transaction(function(t) {

		var gnames = (req.body.geoname) ? models.GeoNames.upsert(req.body.geoname, {
			transaction: t
		}) : Promise.resolve(true);

		return gnames.then(function(gname) {
			return models.Observation.create(req.body, {
				transaction: t
			})
		}).then(function(obs) {

			

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
			.spread(function(taxon, obs) {

				determination.validation = (taxon.acceptedTaxon.attributes.valideringskrav === 0) ? 'Godkendt' : 'Afventer';
				determination.observation_id = obs._id;
				return [models.Determination.create(determination, {
					transaction: t
				}), obs]

			})
			.spread(function(det, obs) {

				obs.primarydetermination_id = det._id;
				var associated = _.map(req.body.associatedOrganisms, function(a) {
					return {
						observation_id: obs._id,
						planttaxon_id: a._id
					}
				})
				var finders = _.map(req.body.users, function(u) {
					return {
						observation_id: obs._id,
						user_id: u._id
					}
				})
				return [obs.save({
					transaction: t
				}), models.ObservationPlantTaxon.bulkCreate(associated, {
					transaction: t
				}), models.ObservationUser.bulkCreate(finders, {
					transaction: t
				})];
			})
			.spread(function(obs) {
				return obs
			})

	}).then(function(obs) {

		return res.status(201).json(obs)
	})
		.
	catch (handleError(res));



};






// Updates an existing taxon in the DB.
exports.update = function(req, res) {
	
	
	var userIsValidator = userTool.hasRole(req.user, 'validator');
	var observation = req.body;
	
	if(!userIsValidator){
		delete observation.noteInternal;
	};

	return models.sequelize.transaction(function(t) {

		var gnames = (req.body.geoname) ? models.GeoNames.upsert(req.body.geoname, {
			transaction: t
		}) : Promise.resolve(true);

		return gnames.then(function(gname) {
			return models.Observation.find({
				where: {
					_id: req.params.id
				} 
			}, {
				transaction: t
			})


		}).then(function(obs) {


			if (!obs) {
				res.send(404);
			};
			
			if(req.user._id !== obs.primaryuser_id &&  !userIsValidator){
				
				throw "Forbidden"
			}
			
			if(obs.decimalLatitude !== req.body.decimalLatitude || obs.decimalLongitude !== req.body.decimalLongitude){
				obs.set('geom', models.sequelize.fn('GeomFromText', 'POINT (' + req.body.decimalLongitude + ' ' + req.body.decimalLatitude + ')'));
			}
			// update attributes
			obs.set(req.body);
			if(req.body.geoname && obs.locality_id !== null) {
				obs.set('locality_id',  null)
			}
			if(req.body.locality_id && obs.geonameId !== null) {
				obs.set('geonameId',  null);
				obs.set('verbatimLocality',  null);
			}
			var changed = obs.changed();

			return [obs.save({
				transaction: t
			}), obs.setAssociatedTaxa(_.map(req.body.associatedOrganisms, function(e) {
				return e._id
			}), {
				transaction: t
			}), obs.setUsers(_.map(req.body.users, function(e) {
				return e._id
			}), {
				transaction: t
			}), changed];

		})

		.spread(function(obs, associated, users, changed) {
			var json = {};
			_.each(changed, function(e){
				json[e] = req.body[e];
			})
			if(associated.length > 0){
				json.associatedOrganisms = _.map(req.body.associatedOrganisms, function(e){ return {_id : e._id, DKandLatinName: e.DKandLatinName}});
			}
			if(users.length > 0){
				json.users = _.map(req.body.users, function(e){ return { _id : e._id, name: e.name, Initialer: e.Initialer}});
			};
			
			var log = (_.isEmpty(json)) ? null :  models.ObservationLog.create({eventname: 'Updated fields', oldvalues: JSON.stringify(json), user_id: req.user._id, observation_id: req.params.id}, {transaction: t});

			return [obs, log];
		})
		.spread(function(obs, log){
			return obs;
		})


	}).then(function(obs) {

		return res.status(200).json(obs)
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


