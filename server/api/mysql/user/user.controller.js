'use strict';

var _ = require('lodash');
var models = require('../');
var User = models.User;
var passport = require('passport');
var config = require('../../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.json(statusCode, err);
  };
};

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
  User.findAll({
    attributes: [
      '_id',
      'name',
      'email',
      'provider',
	'Initialer'
    ],
	include: [{
		model: models.Role
	}]
  })
    .then(function(users) {
		res.status(200).json(users)
    })
    .catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
  var newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
 // newUser.setDataValue('role', 'user');
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresInMinutes: 60 * 5
      });
      res.json({ token: token });
    })
    .catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  var userId = req.params.id;

  User.find({
    where: {
      _id: userId
    },
	include: [{
		model: models.Role
	}]
  })
    .then(function(user) {
      if (!user) {
        return res.send(404);
      }
      res.json(user.profile);
    })
    .catch(function(err) {
      return next(err);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.destroy({ _id: req.params.id })
    .then(respondWith(res, 204))
    .catch(handleError(res));
};



exports.removeRole = function(req, res) {
  models.Userroles.destroy({where :{ user_id: req.params.id, role_id: req.params.roleid }})
    .then(respondWith(res, 204))
    .catch(handleError(res));
};


exports.addRole = function(req, res) {
  models.Userroles.create({ user_id: req.params.id, role_id: req.params.roleid })
    .then(respondWith(res, 201))
    .catch(handleError(res));
};


/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.find({
    where: {
      _id: userId
    }
  })
    .then(function(user) {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(respondWith(res, 200))
          .catch(validationError(res));
      } else {
        return res.send(403);
      }
    });
};

/**
 * Change a users language
 */
exports.changeLanguage = function(req, res, next) {
  var userId = req.user._id;

 return User.update(
	 {preferred_language : req.body.language},
	 {
    where: {
      _id: userId
    }
  })
  .then(respondWith(res, 204))
  .catch(validationError(res));
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;

 return User.find({
    where: {
      _id: userId
    },
    attributes: [
      '_id',
      'name',
	'Initialer',
      'email',
      'provider',
		'facebook',
		'preferred_language'
    ],
	include: [{
		model: models.Role
	}]
  })
    .then(function(user) { // don't ever give out the password or salt
      if (!user) { return res.json(401); }
      return res.json(user.profile);
    })
    .catch(function(err) {
      return next(err);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
