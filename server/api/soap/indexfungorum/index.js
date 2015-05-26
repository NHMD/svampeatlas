'use strict';

var express = require('express');
var controller = require('./indexfungorum.controller');

var router = express.Router();

router.get('/namesearch', controller.NameSearch);
router.get('/epithetsearch', controller.EpithetSearch);
//router.get('/newnames/:rank/:startdate', controller.NewNames);


module.exports = router;
