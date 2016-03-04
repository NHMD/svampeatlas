'use strict';

var express = require('express');
var controller = require('./dyntaxa.controller');
var auth = require('../../../auth/auth.service');
var router = express.Router();

router.get('/token', auth.hasRole('taxonomyadmin'), controller.GetToken);
router.get('/namesearch', controller.NameSearch);
router.get('/statuses', controller.GetTaxonNameStatuses);
router.get('/categories', controller.GetTaxonNameCategories);

router.get('/synonyms/', controller.SynonymSearch);
//router.get('/epithetsearch', controller.EpithetSearch);
//router.get('/namebykey', controller.NameByKey);
//router.get('/newnames/:rank/:startdate', controller.NewNames);


module.exports = router;
