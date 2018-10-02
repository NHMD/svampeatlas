'use strict';

var express = require('express');
var controller = require('./DeterminationVotes.controller');

var auth = require('../../../auth/auth.service');
var redisClient = require('../../../components/hooks/redisClient');

var router = express.Router();

router.get('/', controller.index);

router.get('/count', redisClient.cache(60 * 60 * 24),  controller.count);




module.exports = router;
