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
var Taxon = models.Taxon;


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

// Get list of taxons
exports.index = function(req, res) {
	
	var query = {offset: req.query.offset, limit: req.query.limit, order: req.query.order};
	if(req.query.where){
		query['where'] = JSON.parse(req.query.where);
	}
	

  Taxon.findAndCount(query)
    .then(function(taxon) {
		res.set('count', taxon.count );
		if(req.query.offset){
			res.set('offset', req.query.offset );
		};
		if(req.query.limit){
			res.set('limit', req.query.limit );
		};
		
		return res.json(200, taxon.rows);
	})
    .catch(handleError(res));
};

// Get a single taxon
exports.show = function(req, res) {
  Taxon.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new taxon in the DB.
exports.create = function(req, res) {
  Taxon.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing taxon in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Taxon.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
  Taxon.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};


exports.showTree = function(req, res) {

	
	var query = {
		where: {RankID: 10},
		attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
		include: [{
			model: models.Taxon,
			attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
			as: "children",
			include: [{
				model: models.Taxon,
				attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
				as: "children",
				include: [{
					model: models.Taxon,
					attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
					as: "children",
					include: [{
						model: models.Taxon,
						attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
						as: "children",
						include: [{
							model: models.Taxon,
							attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
							as: "children",
							include: [{
								model: models.Taxon,
								attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
								as: "children",
								include: [{
									model: models.Taxon,
									attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
									as: "children",
									include: [{
										model: models.Taxon,
										attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
										as: "children",
										include: [{
											model: models.Taxon,
											attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
											as: "children",
											include: [{
												model: models.Taxon,
												attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
												as: "children",
												include: [{
													model: models.Taxon,
													attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
													as: "children",
													include: [{
														model: models.Taxon,
														attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
														as: "children",
														include: [{
															model: models.Taxon,
															attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
															as: "children",
															include: [{
																model: models.Taxon,
																attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
																as: "children",
																include: [{
																	model: models.Taxon,
																	attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
																	as: "children",
																	include: [{
																		model: models.Taxon,
																		attributes: ['_id', 'parent_id', 'TaxonName', 'taxonomic_rank'],
																		as: "children"
																	}]
																}]
															}]
														}]
													}]
												}]
											}]
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			}]
		}]
	};
	
  Taxon.findOne(query)
    .then(responseWithResult(res))
    .catch(handleError(res));

	};
