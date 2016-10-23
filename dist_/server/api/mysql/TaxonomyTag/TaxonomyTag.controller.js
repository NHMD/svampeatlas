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
var TaxonomyTag = models.TaxonomyTag;
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
TaxonomyTag.findAndCount(query)
	.then(function(TaxonTag) {
		res.set('count', TaxonTag.count);
		if (req.query.offset) {
			res.set('offset', req.query.offset);
		};
		if (req.query.limit) {
			res.set('limit', req.query.limit);
		};

		return res.status(200).json(TaxonTag.rows);
	})
	.
catch (handleError(res));
};

// Get a single thing
exports.show = function(req, res) {
  TaxonomyTag.find({
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
	var tag = 	req.body;
	tag.tagowner = req.user._id;
  TaxonomyTag.create(tag)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};



// Deletes a thing from the DB.
exports.destroy = function(req, res) {
	
  TaxonomyTag.find({
    where: {
      _id: req.params.id,
	tagowner: req.user._id	
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};



exports.showTaxonomyTags = function(req, res) {
	
	//TaxonTag
	models.Taxon.find({
		where: {
			_id: req.params.id
		},
		include: [ {
				model: models.TaxonomyTag,
				as: 'tags'
			}

		]
	})
		.then(handleEntityNotFound(res))
		.then(function(taxon){
			return res.status(200).json(taxon.tags);
		})
		.
	catch (handleError(res));
};

exports.addTaxonomyTag= function(req, res) {

models.TaxonTag.create({tag_id: req.body._id, taxon_id: req.params.id})
	.then(function() {

		return [models.TaxonomyTag.find({where: {_id:req.body._id}}), models.Taxon.find({where: {_id:req.params.id}})]
	})
	.spread(function(tag, taxon) {

		return  models.TaxonLog.create({
			eventname: "Tag added",
			description: taxon.FullName + " (id: "+taxon._id+") was tagged: '"+tag.tagname+"'",
			user_id: req.user._id,
			taxon_id: taxon._id
	
		})
	})
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

exports.deleteTaxonomyTag = function(req, res) {

models.TaxonTag.find({
    where: {
     taxon_id: req.params.id,
		tag_id: 	req.params.tagid
    }
  })
  .then(handleEntityNotFound(res))
  .then(function(taxonTag){
	  return models.TaxonTag.destroy({where: taxonTag.dataValues});
  })
.then(function() {

	return [models.TaxonomyTag.find({where: {_id:req.params.tagid}}), models.Taxon.find({where: {_id:req.params.id}})]
})
.spread(function(tag, taxon) {

	return  models.TaxonLog.create({
		eventname: "Tag removed",
		description: "Tag: '"+tag.tagname+"' was removed from "+taxon.FullName + " (id: "+taxon._id+") ",
		user_id: req.user._id,
		taxon_id: taxon._id

	})
})
  .then(function(){
	  return res.status(204).send()
  })
  .catch(handleError(res));
};


exports.batchAddTaxonomyTag = function(req, res) {
		
	var promises = [];
	
	_.each(req.body, function(e){
		promises.push(models.TaxonTag.upsert({ taxon_id: e._id, tag_id: req.params.id}));
	})
	
	return Promise.all(promises)
	.then(function(){
	  return res.status(201).send()
  })
    .catch(handleError(res));
}

exports.batchRemoveTaxonomyTag = function(req, res) {

return models.TaxonTag.destroy(
	{where :{ tag_id: req.params.id, taxon_id: _.map(req.body, function(e){
	return e._id;
})

}
}
)
.then(function(){
  return res.status(204).send()
})
  .catch(handleError(res));
}
