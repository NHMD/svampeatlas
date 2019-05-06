'use strict';

var express = require('express');
var controller = require('./geonames.controller');
var auth = require('../../../auth/auth.service');
var router = express.Router();

router.get('/findnearby', controller.findNearbyJSON);

router.get('/countries', controller.getCountries)


//router.get('/newnames/:rank/:startdate', controller.NewNames);


module.exports = router;
