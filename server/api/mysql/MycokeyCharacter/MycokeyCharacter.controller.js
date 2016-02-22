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
var models = require('../')
var MycokeyCharacter = models.MycokeyCharacter;

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
exports.index = function(req, res) {
	var query = {
		offset: req.query.offset,
		limit: req.query.limit,
		order: req.query.order
	};
	if (req.query.where) {
		query['where'] = JSON.parse(req.query.where);
	}

	if (req.query.include) {
		var include = JSON.parse(req.query.include)
		
	query['include'] =	_.map(include, function(n){
		n.model = models[n.model];
		if(n.where) {
			n.where = JSON.parse(n.where)
		}
		return n;
		})	
	}
MycokeyCharacter.findAndCount(query)
	.then(function(character) {
		res.set('count', character.count);
		if (req.query.offset) {
			res.set('offset', req.query.offset);
		};
		if (req.query.limit) {
			res.set('limit', req.query.limit);
		};

		return res.status(200).json(character.rows);
	})
	.
catch (handleError(res));
};

// Get a single thing
exports.show = function(req, res) {
  MycokeyCharacter.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};







