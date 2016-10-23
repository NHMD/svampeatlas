'use strict';
var _ = require('lodash');
var models = require('../')
var ObservationLog = models.ObservationLog;
var userTool = require("../userTool")

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
// Gets list of ObservationLogLogs from the DB.
// Get list of ObservationLogs
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
		
		
		if(n.model === "User"){
			
			n = userTool.secureUser(n);
			
		} 
		
		n.model = models[n.model];
		if(n.where) {
			n.where = JSON.parse(n.where)
		}
		return n;
		})	
	}
/*
	query.include = [{
			model: models.User,
			attributes: ['_id', 'name', 'email'],
			as: "User"}, 
		{
					model: models.Taxon,
					attributes: ['_id', 'FullName'],
					as: "Taxon"}
	];
	*/	
	ObservationLog.findAndCount(query)
		.then(function(ObservationLog) {
			res.set('count', ObservationLog.count);
			if (req.query.offset) {
				res.set('offset', req.query.offset);
			};
			if (req.query.limit) {
				res.set('limit', req.query.limit);
			};

			return res.status(200).json(ObservationLog.rows);
		})
		.
	catch (handleError(res));
};
