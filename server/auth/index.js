'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/mysql').User;
var auth = require('./auth.service');
// Passport Configuration
require('./local/passport').setup(User, config);
require('./facebook/passport').setup(User, config);
require('./google/passport').setup(User, config);

var redisClient = require('../components/hooks/redisClient');


var router = express.Router();

router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/google', require('./google'));

router.post('/forgot',  auth.forgot);
router.post('/pendingusers', redisClient.use(), auth.createPendingUser);


module.exports = router;
