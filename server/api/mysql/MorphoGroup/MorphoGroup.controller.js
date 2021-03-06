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
var UserMorphoGroupImpact = models.UserMorphoGroupImpact;
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


// Creates a new thing in the DB.
exports.create = function(req, res) {
	var group = req.body;
	group.createdbyuser_id = req.user._id;
	MorphoGroup.create(group)
		.then(responseWithResult(res, 201))
		.catch(handleError(res));
};



// Deletes a thing from the DB.
exports.destroy = function(req, res) {

	return models.sequelize.transaction(function(t) {

			return UserMorphoGroupImpact.destroy({
				where: {
					morphogroup_id: req.params.id
				},
				transaction: t
			}).then(function() {

				return MorphoGroup.destroy({
					where: {
						_id: req.params.id
					},
					transaction: t
				})

			})

		})
		.then(function() {
			return res.send(204);

		})
		.catch(handleError(res));

};


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

		query['include'] = _.map(include, function(n) {


			if (n.model === "User") {

				n = userTool.secureUser(n);

			}

			n.model = models[n.model];
			if (n.where) {
				n.where = JSON.parse(n.where)
			}
			return n;
		})
	}

	MorphoGroup.findAndCountAll(query)
		.then(function(morphogroup) {
			res.set('count', morphogroup.count);

			return res.status(200).json(morphogroup.rows)
		})
		.
	catch(handleError(res));

};


exports.update = function(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	MorphoGroup.find({
			where: {
				_id: req.params.id
			}
		})
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(responseWithResult(res))
		.catch(handleError(res));
};


exports.batchUpdateMorphoGroup = function(req, res) {

	MorphoGroup.find({
			where: {
				_id: req.params.id
			}
		})
		.then(function(morphoGroup) {
			if (!morphoGroup) {
				throw new Error("Not found")
			}

			var taxonIds = _.map(req.body, function(e) {
				return e._id;
			})
			return models.Taxon.update({
				morphogroup_id: morphoGroup._id
			}, {
				where: {
					_id: taxonIds
				}
			})
		})

	.then(function() {
			return res.status(201).send()
		})
		.catch(function(err) {
			var statusCode = (err.message = "Not found") ? 404 : 500;
			return res.status(statusCode).send(err.message)
		});
}

exports.mergeMorphoGroups = function(req, res) {

	
	var sql = `UPDATE Taxon SET morphogroup_id = :targetid WHERE morphogroup_id= :id;`
	var deleteSql = `DELETE FROM MorphoGroup WHERE _id = :id`;
	return models.sequelize.transaction(function(t) {
		return models.sequelize.query(sql, {
		replacements: {
			targetid: req.body.targetid,
			id: req.body.id
		},
		type: models.sequelize.QueryTypes.UPDATE,
		transaction: t
	})
	.then(function(){
		return models.sequelize.query(deleteSql, {
		replacements: {
			id: req.body.id
		},
		type: models.sequelize.QueryTypes.DELETE,
		transaction: t
	})
	})
	.then(function(result) {

		return res.sendStatus(200);
	}).catch(handleError(res));
		
		
	});


	
}

exports.getUsers = function(req, res) {
	
	
		var sql = `SELECT m.name_dk, m.name_uk, m.taxonCount, u._id, u.name, um.impact, um.min_impact, um.max_impact 
					FROM Users u, 
					(SELECT mx._id, mx.name_dk, mx.name_uk, count(t._id) as taxonCount FROM MorphoGroup mx LEFT JOIN Taxon t ON t.morphogroup_id=mx._id WHERE t.accepted_id= t._id GROUP BY mx._id) m, 
					UserMorphoGroupImpact um 
					WHERE m._id=um.morphogroup_id AND um.user_id=u._id AND m._id=:id ORDER BY LEAST(GREATEST(um.impact, um.min_impact), um.max_impact) DESC`
	
		return models.sequelize.query(sql, {
		replacements: {
			id: req.params.id
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));
}
