'use strict';

var models = require('../')

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



exports.showImages = function(req, res){
	models.TaxonImages.findAll({
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
exports.addImage = function(req, res) {
	models.TaxonImages.create(req.body)
		.then(responseWithResult(res, 201))
	.catch (handleError(res));
};

// Deletes a taxon image from the DB.
exports.deleteImage = function(req, res) {
	models.TaxonImages.find({
		where: {
			_id: req.params.imgid,
			taxon_id: req.params.id
			
		}
	})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch (handleError(res));
};

// Updates an existing taxon in the DB.
exports.updateImage = function(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	console.log(JSON.stringify(req.params))
	models.TaxonImages.find({
		where: {
			_id: req.params.imgid,
			taxon_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(responseWithResult(res))
		.
	catch (handleError(res));
};
