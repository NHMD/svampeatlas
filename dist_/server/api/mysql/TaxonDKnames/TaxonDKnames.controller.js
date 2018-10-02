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
	var query = {
		offset: req.query.offset,
		limit: req.query.limit,
		order: req.query.order,
		where: {}
	};

	if (req.query.acceptedTaxaOnly) {
		_.merge(query.where, {
			_id: {
				$eq: models.sequelize.col("accepted_id")
			}
		});

	}

	if (req.query.where) {
		_.merge(query.where, JSON.parse(req.query.where));
	}
	
	if (req.query.include) {
		var include = JSON.parse(req.query.include)

		query['include'] = _.map(include, function(n) {
			
			n.model = models[n.model];
			if (n.where) {
				n.where = JSON.parse(n.where);

				if (n.where.$and && n.where.$and.length > 0) {

					for (var i = 0; i < n.where.$and.length; i++) {
						n.where.$and[i] = JSON.parse(n.where.$and[i]);
					}
				}
				
			}
			console.log(n.where)
			return n;
		});
		
	
	}
	

models.TaxonDKnames.findAndCount(query)
	.then(function(taxon) {
		res.set('count', taxon.count);
		if (req.query.offset) {
			res.set('offset', req.query.offset);
		};
		if (req.query.limit) {
			res.set('limit', req.query.limit);
		};
		return res.status(200).json(taxon.rows)
	})
	
};

// Get a single thing
exports.show = function(req, res) {
  models.TaxonDKnames.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

exports.showNames = function(req, res){
	models.TaxonDKnames.findAll({
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
exports.addName = function(req, res) {
	models.TaxonDKnames.create(req.body)
		.then(responseWithResult(res, 201))
	.catch (handleError(res));
};

// Deletes a taxon image from the DB.
exports.deleteName = function(req, res) {
	models.TaxonDKnames.find({
		where: {
			_id: req.params.nameid,
			taxon_id: req.params.id
			
		}
	})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch (handleError(res));
};

// Updates an existing taxon in the DB.
exports.updateName = function(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	console.log(JSON.stringify(req.params))
	models.TaxonDKnames.find({
		where: {
			_id: req.params.nameid,
			taxon_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(responseWithResult(res))
		.
	catch (handleError(res));
};
