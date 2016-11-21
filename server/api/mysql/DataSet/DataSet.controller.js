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
var config = require('../../../config/environment');


function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		console.log(err);
		res.status(statusCode).send(err);
	};
}

function cacheResult(req, value) {
	var redisClient = req.redis;

	return redisClient.setAsync(req.query.cachekey, value)
		.then(function() {
			return redisClient.expireAsync(req.query.cachekey, config.redisTTL[req.query.cachekey])
		})
		.catch(function(err) {
			console.log("error: " + err)
		})

}



exports.index = function(req, res) {
	//SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country
	
	var sql = 'SELECT dataSource, count(_id) as count FROM `Observation` group by dataSource';


	return models.sequelize.query(sql, {
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {
		

		if (req.query.cachekey && req.query.cachekey === "dataSet") {
			return cacheResult(req, JSON.stringify(result)).then(function() {
				return res.status(200).json(result)
			})
		} else {
			return res.status(200).json(result)
		}

		return res.status(200).json(result);
	}).catch(handleError(res));


};
