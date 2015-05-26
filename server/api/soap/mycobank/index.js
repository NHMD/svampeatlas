'use strict';

var express = require('express');
var controller = require('./mycobank.controller');

var router = express.Router();

//router.get('/search', controller.Mycobank);
router.get('/search', controller.Mycobank);
//router.get('/epithetsearch', controller.EpithetSearch);
//router.get('/newnames/:rank/:startdate', controller.NewNames);


module.exports = router;
