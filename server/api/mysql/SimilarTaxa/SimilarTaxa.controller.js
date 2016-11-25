'use strict';

var models = require('../')
var _ = require('lodash');
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

	var where = {};
	// if it was called from taxon endpoint the req.params.id refers to taxon_id
	if(req.params.id){
		where = { $or: [{ taxon1_id: req.params.id}, { taxon2_id: req.params.id}] }
	} else if(req.query.where) {
		
		where = JSON.parse(req.query.where)
	}



    models.SimilarTaxa.findAll({
      where: where,
	  include: [{
	  	model: models.Taxon,
		  as: "Taxon1" ,
		  include: [{
		  	model: models.Taxon,
			  as: "acceptedTaxon" , 
			  include: [{
			  	model: models.TaxonDKnames,
				  as: "Vernacularname_DK"  
			  }] 
		  }] 
	  },{
	  	model: models.Taxon,
		  as: "Taxon2"  ,
		  include: [{
		  	model: models.Taxon,
			  as: "acceptedTaxon"  , 
			  include: [{
			  	model: models.TaxonDKnames,
				  as: "Vernacularname_DK"  
			  }] 
		  }] 
	  },{
	  	model: models.User,
		  as: "User",
		  attributes: ['name', 'Initialer']  
	  }]
    })
      .then(handleEntityNotFound(res))
      .then(responseWithResult(res))
      .catch(handleError(res));
	
};

// Get a single thing
exports.show = function(req, res) {
  models.SimilarTaxa.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

exports.showSimilarTaxa = function(req, res){
	models.SimilarTaxa.findAll({
		where: {
			taxon_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res, 200))
		.
	catch (handleError(res));
	
}

// Creates a new taxon in the DB.
exports.addSimilarTaxon = function(req, res) {
	var similarTaxon = req.body;
	similarTaxon.createdbyuser_id = req.user._id;
	
	models.SimilarTaxa.create(req.body)
		.then(function(smt){
		  return  models.SimilarTaxa.find({
		      where: {_id: smt._id},
			 include: [{
	  	model: models.Taxon,
		  as: "Taxon1" ,
		  include: [{
		  	model: models.Taxon,
			  as: "acceptedTaxon" , 
			  include: [{
			  	model: models.TaxonDKnames,
				  as: "Vernacularname_DK"  
			  }] 
		  }] 
	  },{
	  	model: models.Taxon,
		  as: "Taxon2"  ,
		  include: [{
		  	model: models.Taxon,
			  as: "acceptedTaxon"  , 
			  include: [{
			  	model: models.TaxonDKnames,
				  as: "Vernacularname_DK"  
			  }] 
		  }] 
	  },{
	  	model: models.User,
		  as: "User",
		  attributes: ['name', 'Initialer']  
	  }]
		    })
		})
		.then(responseWithResult(res))
	.catch (handleError(res));
};

// Deletes a taxon image from the DB.
exports.deleteSimilarTaxon = function(req, res) {
	models.SimilarTaxa.find({
		where: {
			_id: req.params.id
			
			
		}
	})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch (handleError(res));
};

// Updates an existing taxon in the DB.
exports.updateSimilarTaxon = function(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	
	models.SimilarTaxa.find({
		where: {
			_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
	.then(function(smt){
	  return  models.SimilarTaxa.find({
	      where: {_id: smt._id},
		  include: [{
		  	model: models.Taxon,
			  as: "Taxon1" ,
			  include: [{
			  	model: models.Taxon,
				  as: "acceptedTaxon" , 
				  include: [{
				  	model: models.TaxonDKnames,
					  as: "Vernacularname_DK"  
				  }] 
			  }] 
		  },{
		  	model: models.Taxon,
			  as: "Taxon2"  ,
			  include: [{
			  	model: models.Taxon,
				  as: "acceptedTaxon"  , 
				  include: [{
				  	model: models.TaxonDKnames,
					  as: "Vernacularname_DK"  
				  }] 
			  }] 
		  },{
		  	model: models.User,
			  as: "User",
			  attributes: ['name', 'Initialer']  
		  }]
	    })
	})
		.then(responseWithResult(res))
		.
	catch (handleError(res));
};
