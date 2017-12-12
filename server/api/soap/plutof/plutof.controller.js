/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';


var _ = require('lodash');
var Client = require('node-rest-client').Client;
var client = new Client();

client.registerMethod("taxonnodes", "https://api.plutof.ut.ee/v1/taxonomy/taxonnodes/search/", "GET");
client.registerMethod("specieshypothesis", "https://api.plutof.ut.ee/v1/globalkey/dshclusters/search/", "GET");
client.registerMethod("gettoken", "https://api.plutof.ut.ee/oauth2/access_token/", "POST");

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
exports.TaxonNodes = function(req, res) {
	var access_token = req.headers.plutofauthorization;
	client.methods.taxonnodes({headers: {Authorization: "Bearer "+access_token}, parameters: {search_query : "Cortinarius vesterholtii"}},function(data,response){
	    // parsed response body as js object 
	    return res.status(response.statusCode).json(data);
	    // raw response 

	});

};

exports.SpeciesHypothesis = function(req, res) {
	
	var access_token = req.headers.plutofauthorization;
	client.methods.taxonnodes({headers: {Authorization: "Bearer "+access_token}, parameters: {q : req.query.search_query, filter_type:"exact"}},function(taxon,response){
		
	
		if(taxon.results && taxon.results.length > 0) {
		
		var access_token = req.headers.plutofauthorization;
		client.methods.specieshypothesis({headers: {Authorization: "Bearer "+access_token}, parameters: {taxon_node : taxon.results[0].id}}, function(data,response){
			return res.status(response.statusCode).json(data);
		});
	   } else {
	   		return res.send(404);
	   }
	    // raw response 

	}, function(err){
		return res.status(500)
	});

};

exports.GetToken = function(req, res) {
	
	var access_token = req.headers.plutofauthorization;
	client.methods.gettoken({ parameters: {scope : "read", grant_type:"password", client_id: config.plutof.client_id, client_secret: config.plutof.client_secret, username: config.plutof.username, password: config.plutof.password}},function(data,response){
	    
			 return (parseInt(response.statusCode) < 400) ? res.status(response.statusCode).json(data) : res.sendStatus(404);
	}, function(err){
		return res.status(500)
	});

};




