'use strict';

var express = require('express');
var controller = require('./plutof.controller');
var auth = require('../../../auth/auth.service');
var router = express.Router();

router.get('/taxonnodes', controller.TaxonNodes);
router.get('/specieshypothesis', controller.SpeciesHypothesis);
router.get('/token', auth.hasRole('taxonomyadmin'), controller.GetToken);
//router.get('/newnames/:rank/:startdate', controller.NewNames);


module.exports = router;
