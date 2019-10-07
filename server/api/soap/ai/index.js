'use strict';

var express = require('express');
var controller = require('./ai.controller');
var auth = require('../../../auth/auth.service');
var router = express.Router();

router.post('/', controller.getMatches);

//router.get('/newnames/:rank/:startdate', controller.NewNames);


module.exports = router;
