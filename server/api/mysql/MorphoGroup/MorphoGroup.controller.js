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
var MorphoGroup = models.MorphoGroup;
var Promise = require("bluebird");
var userTool = require("../userTool");

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


	MorphoGroup.findAndCountAll()
		.then(function(morphogroup) {
			res.set('count', morphogroup.count);
			
			return res.status(200).json(morphogroup.rows)
		})
		.
	catch(handleError(res));

};


exports.batchUpdateMorphoGroup = function(req, res) {
		
	MorphoGroup.find({where: {_id: req.params.id}})
	.then(function(morphoGroup){
		if (!morphoGroup) {
			throw new Error("Not found")
		}
		
		var taxonIds = _.map(req.body, function(e){
			return e._id;
		})
		return models.Taxon.update({morphogroup_id: morphoGroup._id}, {where :{_id: taxonIds}})
	})
	
	.then(function(){
	  return res.status(201).send()
  })
    .catch(function(err){
    	var statusCode = (err.message = "Not found")? 404 : 500;
		return res.status(statusCode).send(err.message)
    });
}


