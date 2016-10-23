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
var Locality = models.Locality;
var Promise = require("bluebird");

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
		var parsed = JSON.parse(req.query.include)
		query['include'] = _.map(parsed, function(n) {
			var n = JSON.parse(n);

			if (n.model === "User") {

				n = userTool.secureUser(n);

			}


			if (n.model === 'DeterminationView' && n.include) {
				n.include = JSON.parse(n.include);
				for (var i = 0; i < n.include.length; i++) {

					n.include[i] = JSON.parse(n.include[i])
					if (n.include[i].model === "User") {

						n.include[i] = userTool.secureUser(n.include[i]);

					};
					n.include[i].model = models[n.include[i].model]


					//n.include[i].where = JSON.parse(n.include[i].where)

				}

			}

			n.model = models[n.model];
			return n;
		})
		
	
	}

	
	Locality.findAndCount(query)
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
	Locality.find({
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

exports.localititesWithRecentFindings = function(req, res){
	
	return models.sequelize.query(
		'SELECT l._id, l.decimalLatitude, l.decimalLongitude, l.name FROM Locality l JOIN Observation o ON o.locality_id = l._id '
		+'AND DATE_ADD(CURDATE(), INTERVAL :days DAY) < DATE(o.observationDate) GROUP BY l._id',
  { replacements: { days: -Math.abs(req.query.days) }, type: models.sequelize.QueryTypes.SELECT }
).then(function(localities){
	
	if(req.query.cachekey) {
		return cacheResult(req, JSON.stringify(localities)).then(function(){
			return res.status(200).json(localities)
		})
	} else {
		return res.status(200).json(localities)
	}
	
})
	.
catch (handleError(res));
	
}

// Creates a new taxon in the DB.
exports.create = function(req, res) {

};



// Updates an existing taxon in the DB.
exports.update = function(req, res) {

	
};


// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
	Locality.find({
		where: {
			_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch (handleError(res));
};


