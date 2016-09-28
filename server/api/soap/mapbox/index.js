'use strict';

var express = require('express');
var controller = require('./mapbox.controller');
var auth = require('../../../auth/auth.service');
var router = express.Router();

router.get('/token', controller.getToken);

//router.get('/newnames/:rank/:startdate', controller.NewNames);


module.exports = router;
