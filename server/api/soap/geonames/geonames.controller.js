/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var models = require('../../mysql')
var GeoNames = models.GeoNames;
var _ = require('lodash');
var Client = require('node-rest-client').Client;
var client = new Client();
var config = require('../../../config/environment');
client.registerMethod("findNearbyJSON", "http://api.geonames.org/findNearbyJSON", "GET");


var config = require('../../../config/environment');


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
			return res.status(statusCode).json(entity);
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

exports.getCountries = function(req, res) {
	//SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country
	
	var sql = 'SELECT distinct countryName FROM `GeoNames`';


	return models.sequelize.query(sql, {
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {
		

			return res.status(200).json(result)
		

	}).catch(handleError(res));


};

// Get list of things
exports.findNearbyJSON = function(req, res) {
	
	client.methods.findNearbyJSON({parameters: _.merge(req.query, {username: config.geonames})},function(data,response){
	    // parsed response body as js object 
	    return res.status(response.statusCode).json(data);
	    // raw response 

	});

};





