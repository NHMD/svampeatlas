'use strict';

var express = require('express');
var controller = require('./Competition.controller');
var auth = require('../../../auth/auth.service');
var redisClient = require('../../../components/hooks/redisClient');

var router = express.Router();


//router.get('/:id/observations/taxonomy/:rankid',/* auth.isAuthenticated(),*/ controller.showObservationCountAsHigherTaxonomy);
//router.get('/:id/observations/count',/* auth.isAuthenticated(),*/ controller.showObservationCount);
//router.get('/:id/forumposts/count',/* auth.isAuthenticated(),*/ controller.showForumCount);
//router.get('/:id/images/count',/* auth.isAuthenticated(),*/ controller.showImageCount);
router.get('/speciescount/:year',redisClient.use(), controller.showSpeciesCount);
router.get('/numberofobservations/:year?',redisClient.use(), controller.showObservationCount);
router.get('/numberofmobileobservations/:year?',redisClient.use(), controller.showMobileObservationCount);
router.get('/numberofarchiveobservations/:year?',redisClient.use(), controller.showArchiveObservationCount);

router.get('/pioneer/:year',redisClient.use(), controller.showNewTaxonInAreaCount);

router.get('/highjumper/:year',redisClient.use(), controller.showNewTaxonCountOnPersonalList);





module.exports = router;
