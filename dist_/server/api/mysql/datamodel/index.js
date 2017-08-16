'use strict';

var express = require('express');
var controller = require('./datamodel.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/',  controller.index);
router.get('/:model', controller.show);


module.exports = router;