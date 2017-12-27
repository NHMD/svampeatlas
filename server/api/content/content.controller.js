/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var rp = require("request-promise"),
showdown = require("showdown");

var  converter = new showdown.Converter();

//var config = require('../../../config/environment');


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

// Get  municipality
exports.show = function(req, res) {
	

	rp.get(`https://raw.githubusercontent.com/NHMD/svampeatlas-content/master/${req.params.id}_${req.params.locale}.md`)
	.then(function(md){
		let html = converter.makeHtml(md);
		
		res.status(200).send(html);
	})
	.catch(function(err){
		
		res.status(err.statusCode || 500).send(err.message);
	})
	
	
	


};





