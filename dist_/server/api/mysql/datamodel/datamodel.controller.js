'use strict';
var models = require('../');
var _ = require('lodash');


exports.index = function(req, res) {

	var modelNames = _.filter(Object.keys(models), function(str) {
		return str !== 'sequelize' && str !== 'Sequelize';
	});
	

	var datamodels = _.map(modelNames, function(modelName) {
		return models[modelName].describe().then(function(fields) {

			return {
				name: modelName,
				fields: fields
			}
		});
		
	});
	Promise.all(datamodels).then(function(datamodels){
		return res.status(200).json(datamodels);
	})
	.catch (function(err) {
			handleError(res, err);
		});
		

};

// Get  fields for a model
exports.show = function(req, res) {
	console.log(JSON.stringify(req.params))
	var model = req.params.model.charAt(0).toUpperCase() + req.params.model.slice(1);
	models[model].describe().then(function(fields) {

		return res.json(200, fields);
	}).
	catch (function(err) {
		handleError(res, err);
	});
};


function handleError(res, err) {
	return res.send(500, err);
}
