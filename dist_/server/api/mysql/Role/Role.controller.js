'use strict';

var _ = require('lodash');
var models = require('../');
var Role = models.Role;

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.send(statusCode, err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.send(statusCode);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  Role.findAll()
    .then(function(roles) {
		res.status(200).json(roles)
    })
    .catch(handleError(res));
};