'use strict';

var models = require('../')
var TaxonRedListData = models.TaxonRedListData;

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

exports.categories = function(req, res) {
	
	models.sequelize.query('select  status, year from TaxonRedListData where status IS NOT NULL AND year=(select MAX(year) from TaxonRedListData) GROUP BY status, year' ,
{ type: models.sequelize.QueryTypes.SELECT})
		.then(function(categories) {

			return res.status(200).json(categories);
		})
		.
	catch (handleError(res));
};

// Gets list of TaxonRedListData from the DB.
// Get list of TaxonRedListData
exports.index = function(req, res) {

	var query = {
		offset: req.query.offset,
		limit: req.query.limit,
		order: req.query.order
	};
	if (req.query.where) {
		query['where'] = JSON.parse(req.query.where);
	}

		
	TaxonRedListData.findAndCount(query)
		.then(function(TaxonRedListData) {
			res.set('count', TaxonRedListData.count);
			if (req.query.offset) {
				res.set('offset', req.query.offset);
			};
			if (req.query.limit) {
				res.set('limit', req.query.limit);
			};

			return res.json(200, TaxonRedListData.rows);
		})
		.
	catch (handleError(res));
};

// Get a single thing
exports.show = function(req, res) {
  TaxonRedListData.find({
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
  TaxonRedListData.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  TaxonRedListData.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  TaxonRedListData.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
