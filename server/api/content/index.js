'use strict';

var express = require('express');
var controller = require('./content.controller');

var router = express.Router();



router.get('/:locale/:id\.html', controller.show);


module.exports = router;
