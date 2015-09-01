'use strict';

var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/mysql').User;
var Role = require('../api/mysql').Role;
var _ = require('lodash');
var validateJwt = expressJwt({
  secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
		console.log("XXXXXXXXX TOKEN FOUND")
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.find({
        where: {
          _id: req.user._id
        },
		include: [{
			model: Role}]
      })
        .then(function(user) {
          if (!user) {
            return res.send(401);
          }
          req.user = user;
          next();
        })
        .catch(function(err) {
          return next(err);
        });
    });
}


/**
 * If there is a user, appends it to the req
 * else req.user would be undefined
 */
 function appendUser() {
    return compose()
        // Attach user to request
        .use(function(req, res, next) {
            validateJwt(req, res, function(val) {
                if(_.isUndefined(val)) {
					
			        User.find({
			          where: {
			            _id: req.user._id
			          },
			  		include: [{
			  			model: Role}]
			        })
			        .then(function(user) {
			          if (!user) {
                          req.user = undefined;
                          return next();
			          } else {
			          req.user = user;
			          next();
				  }
			        })
			        .catch(function(err) {
						console.log("ERROR "+err)
			          return next(err);
			        });
					
			
                } else {
                    req.user = undefined;
                    next();
                }
            });
        });
}

/**
 * Takes the token cookie and adds the header
 * for it on the request
 */
 function addAuthHeaderFromCookie() {
    return compose()
        .use(function(req, res, next) {
            if(req.cookies.token) {
                req.headers.authorization = 'Bearer ' + _.trim(req.cookies.token, '\"');
            }
            return next();
        });
}
/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
		var hasRole = ( _.find(req.user.Roles, function(r) {
			  return r.name === roleRequired;
			}) !== undefined);
      if (hasRole) {
        next();
      }
      else {
        res.send(403);
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, {
    expiresInMinutes: 60 * 5
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) {
    return res.json(404, {
      message: 'Something went wrong, please try again.'
    });
  }
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

function generateInitials(name){
	
	var parts = name.split(" ");
	if(parts.length ===1){
		return parts[0].substring(0,4);
	} else if(parts.length ===2){
		return parts[0].substring(0,2)+parts[1].substring(0,2);
	} else {
		return parts[0].substring(0,1)+parts[1].substring(0,1)+parts[2].substring(0,2);
	}
	
};

function getRandomTwoDigit(){
	return Math.round(Math.random()*100);
}

exports.generateInitials = generateInitials;
exports.getRandomTwoDigit = getRandomTwoDigit;
exports.appendUser = appendUser;
exports.addAuthHeaderFromCookie = addAuthHeaderFromCookie;
exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
