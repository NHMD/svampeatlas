'use strict';

var express = require('express');
var controller = require('./gbif.controller');
var auth = require('../../../auth/auth.service');
var router = express.Router();

router.get('/classificationdiff/:rank', controller.classificationDiff);



module.exports = router;
