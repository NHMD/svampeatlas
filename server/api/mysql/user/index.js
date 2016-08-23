'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.delete('/:id', auth.hasRole('useradmin'), controller.destroy);
router.delete('/:id/roles/:roleid', auth.hasRole('useradmin'), controller.removeRole);

router.post('/:id/roles/:roleid', auth.hasRole('useradmin'), controller.addRole);

router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/me/language', auth.isAuthenticated(), controller.changeLanguage);
router.put('/me/email', auth.isAuthenticated(), controller.changeEmail);
router.get('/:id',/* auth.isAuthenticated(),*/ controller.show);
router.get('/:id/firstfindings/:year',/* auth.isAuthenticated(),*/ controller.showFirstFindings);
router.get('/:id/observations/taxonomy/:rankid',/* auth.isAuthenticated(),*/ controller.showObservationCountAsHigherTaxonomy);
router.get('/:id/observations/count',/* auth.isAuthenticated(),*/ controller.showObservationCount);
router.get('/:id/forumposts/count',/* auth.isAuthenticated(),*/ controller.showForumCount);
router.get('/:id/images/count',/* auth.isAuthenticated(),*/ controller.showImageCount);
router.get('/:id/species/count',/* auth.isAuthenticated(),*/ controller.showSpeciesCount);
router.get('/:id/countries/count',/* auth.isAuthenticated(),*/ controller.showCountryCount);





router.post('/',auth.hasRole('useradmin'),  controller.create);

module.exports = router;
