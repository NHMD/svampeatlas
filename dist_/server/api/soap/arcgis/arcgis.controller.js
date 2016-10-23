/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var request = require("request");


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

// Get list of things
exports.getToken = function(req, res) {
	
	request.post({
	    url: 'https://www.arcgis.com/sharing/rest/oauth2/token/',
	    json:true,
	    form: {
	      'f': 'json',
	      'client_id': config.arcgis.client_id,
	      'client_secret': config.arcgis.client_secret,
	      'grant_type': 'client_credentials',
	      'expiration': '1440'
	    }
	  }, function(error, response, body){
	    console.log(body.access_token);
	   res.status(200).json(body.access_token);
	  });


};





