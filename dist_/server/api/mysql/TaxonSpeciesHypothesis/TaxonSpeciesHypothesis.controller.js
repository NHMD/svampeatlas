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
var TaxonSpeciesHypothesis = models.TaxonSpeciesHypothesis;

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
	  
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

// Get list of things
exports.index = function(req, res) {
  TaxonSpeciesHypothesis.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Get a single thing
exports.show = function(req, res) {
  TaxonSpeciesHypothesis.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  TaxonSpeciesHypothesis.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};



// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  TaxonSpeciesHypothesis.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};



exports.showSpeciesHypothesis = function(req, res){
	models.TaxonSpeciesHypothesis.findAll({
		where: {
			taxon_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res, 200))
		.
	catch (handleError(res));
	
}

exports.addSpeciesHypothesis= function(req, res) {

models.TaxonSpeciesHypothesis.create({specieshypothesis: req.body.specieshypothesis, taxon_id: req.params.id})
	.then(function(sh) {

		return [sh, models.TaxonLog.create({
			eventname: "Added species hypothesis",
			description: req.body.specieshypothesis + " was added to this taxon",
			user_id: req.user._id,
			taxon_id: req.params.id
	
		})]
	})
    
	.spread(function(sh) {

		return res.status(201).json(sh);
	})
    .catch(handleError(res));
};



exports.deleteSpeciesHypothesis = function(req, res) {

models.TaxonSpeciesHypothesis.find({
    where: {
     taxon_id: req.params.id,
	specieshypothesis: 	req.params.spid
    }
  })
  .then(handleEntityNotFound(res))
  .then(function(taxonSpeciesHypothesis){
	  return models.TaxonSpeciesHypothesis.destroy({where: taxonSpeciesHypothesis.dataValues});
  })
.then(function() {

	return models.TaxonLog.create({
		eventname: "Removed species hypothesis",
		description: req.params.spid + " was removed from this taxon",
		user_id: req.user._id,
		taxon_id: req.params.id

	})
})
  .then(function(){
	 
	  return res.status(204).send()
  })
  .catch(handleError(res));
};
