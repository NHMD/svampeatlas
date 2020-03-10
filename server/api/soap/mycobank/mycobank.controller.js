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




var request = require("request");




function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.send(statusCode, err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.json(statusCode, entity);
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
exports.Mycobank = function(req, res) {
	console.log('http://www.mycobank.org//Services/Generic/SearchService.svc/rest/xml?layout=14682616000000161&filter=Name%20'+req.query.operator+'%20"'+req.query.name+'"&limit='+req.query.limit+'')
	req.pipe(request('http://www.mycobank.org//Services/Generic/SearchService.svc/rest/xml?layout=14682616000000161&filter=Name%20'+req.query.operator+'%20"'+req.query.name+'"&limit='+req.query.limit+'')).pipe(res)
		
};



