'use strict';

var express = require('express');
var controller = require('./DnaSequence.controller');

var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);

router.get('/:id', controller.show);


// router.post('/', auth.hasRole('taxonomyadmin'), controller.create); only on observation endpoint
router.delete('/:id',auth.hasRole('taxonomyadmin'),  controller.destroy);




module.exports = router;
