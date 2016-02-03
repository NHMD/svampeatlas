'use strict';

var express = require('express');
var controller = require('./kms.controller');
var auth = require('../../../auth/auth.service');
var router = express.Router();

router.get('/ticket', controller.getTicket);

//router.get('/newnames/:rank/:startdate', controller.NewNames);


module.exports = router;
