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
var TaxonAttributes = models.TaxonAttributes;
var Promise = require("bluebird");


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



// Get a single taxon
exports.show = function(req, res) {
	TaxonAttributes.find({
		where: {
			_id: req.params.id
		})
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.
	catch (handleError(res));
};


// Creates a new taxon in the DB.
exports.create = function(req, res) {
  TaxonAttributes.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};



// Updates an existing taxon in the DB.
exports.update = function(req, res) {
	
	TaxonAttributes.find({
		where: {
			_id: req.params.id
		}
	})
	.then(function(taxonAttr){
		if(!taxonAttr){
			res.send(404);
		};
		for(var i=0; i< taxonAttr.attributes.length; i++){
			taxon.set(taxonAttr.attributes[i] , req.body[taxonAttr.attributes[i]])
		}
		var changed = taxonAttr.changed().toString();
		
		return [taxonAttr.save(), changed];
		
	})
	.spread(function(taxonAttr, changed){

			return [taxonAttr, models.TaxonLog.create({
			eventname: "Updated taxon attributes",
			description: "Field(s): "+changed,
			user_id: req.user._id,
			taxon_id: taxonAttr.taxon_id
			
		})]
		
	})
	.spread(function(taxonAttr) {
		return TaxonAttributes.find({
			where: {
				taxon_id: taxonAttr.taxon_id
			}
		})
	})
	.then(function(taxonAttr){
	
		return res.status(200).json(taxonAttr);
		
	})
		
		.
	catch (handleError(res));
};

// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
	TaxonAttributes.find({
		where: {
			_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch (handleError(res));
};

