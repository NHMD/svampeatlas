'use strict';

var express = require('express');
var controller = require('./Role.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);



module.exports = router;
