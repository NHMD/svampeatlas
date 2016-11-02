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
var Storedsearch = models.Storedsearch;
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

	var usrid = (req.user) ? req.user._id : undefined
	console.log("####")
	console.log(req.user)
	
	Storedsearch.findAll({where: {user_id: usrid}, attributes: [ '_id', 'name']})
	.then(handleEntityNotFound(res))
		.then(function(searches) {
	
			return res.status(200).json(searches)
		})
		.
	catch (handleError(res));
	
};



// Get a single taxon
exports.show = function(req, res) {
	Storedsearch.find({
		where: {
			_id: req.params.id
		},
		include: {
			model: models.User,
			as: "User",
			attributes: ['_id', 'name', 'Initialer']
		}
		 

	})
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.
	catch (handleError(res));
};




// Creates a new taxon in the DB.
exports.create = function(req, res) {
	
	Storedsearch.create({
		user_id: req.user._id,
		search: req.body.search,
		name : req.body.name
	})
    .then(responseWithResult(res, 201))
    .catch(handleError(res));

};




// Updates an existing taxon in the DB.
exports.update = function(req, res) {
	Storedsearch.find({
		where: {
			_id: req.params.id,
			user_id: req.user._id
		}
	})
		.then(handleEntityNotFound(res))
		.then(function(det){
			return det.update(req.body)
		})
		.then(function(det){
			return res.status(204).json(det)
		})
		.
	catch (handleError(res));
	
};


// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
	Storedsearch.find({
		where: {
			_id: req.params.id,
			user_id: req.user._id
		}
	})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch (handleError(res));
};


