'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var User = require('../../api/mysql').User;
var router = express.Router();

router
.get('/authorize', auth.appendUser(), passport.authorize('facebook', {
  scope: ['email'],
//  failureRedirect: '/signup',
	failureRedirect: '/?fberror=true',
  session: false
}))

  .get('/', auth.appendUser(), passport.authorize('facebook', {
    scope: ['email'],
  //  failureRedirect: '/signup',
	  failureRedirect: '/?fberror=true',
    session: false
  },
 auth.setTokenCookie
))

  .get('/callback', auth.addAuthHeaderFromCookie(), auth.appendUser(), passport.authorize('facebook', {
 //   failureRedirect: '/signup',
	  failureRedirect: '/?fberror=true',
    session: false
  }), 
	  auth.setTokenCookie
  
)

  .delete('/', auth.isAuthenticated() , function(req, res, next){
  	
	  	
	      User.update({ facebook : null}, {where: {
	        '_id': req.user._id
	      }})
			.then(function(user) {
				
                return res.send(204);
              })
             
	        .catch(function(err) {
	          return next(err);
	        });
		
	 
  })
;

module.exports = router;
