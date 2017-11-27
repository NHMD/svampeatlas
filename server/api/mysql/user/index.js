'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../../auth/auth.service');
var redisClient = require('../../../components/hooks/redisClient');

var router = express.Router();

router.get('/', controller.index);
router.get('/count', redisClient.use(), controller.getCount);
router.get('/recent',  controller.getCount);


router.delete('/:id', auth.hasRole('useradmin'), controller.destroy);
router.delete('/:id/roles/:roleid', auth.hasRole('useradmin'), controller.removeRole);

router.post('/:id/roles/:roleid', auth.hasRole('useradmin'), controller.addRole);

router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/me/feed', auth.isAuthenticated(), controller.showNewsFeed);
router.get('/me/feed/count', auth.isAuthenticated(), controller.showNewsCount);
router.put('/me/feed/:id/lastread', auth.isAuthenticated(), controller.markFeedAsRead);
router.delete('/me/feed/:id', auth.isAuthenticated(), controller.unsubscribe);
router.get('/me/morphogrouppositions', auth.appendUser(),  controller.showMyMorphoGroupPositions);


router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/:id/password', auth.isAuthenticated(), controller.resetPassword);
router.put('/me/language', auth.isAuthenticated(), controller.changeLanguage);
router.put('/me/email', auth.isAuthenticated(), controller.changeEmail);
router.put('/me/name', auth.isAuthenticated(), controller.changeName);

router.get('/:id',/* auth.isAuthenticated(),*/ controller.show);
router.get('/:id/morphogroups', auth.hasRole('validator'), controller.showUserMorphoGroups);
router.get('/:id/morphogroups/:morphogroupid', auth.hasRole('validator'), controller.showUserMorphoGroup);
router.get('/:id/morphogrouppositions', auth.hasRole('validator'), controller.showUserMorphoGroupPositions);

router.put('/:id/morphogroups/:morphogroupid', auth.hasRole('validator'), controller.updateUserMorphoGroup);


router.get('/:id/firstfindings/:year',/* auth.isAuthenticated(),*/ controller.showFirstFindings);
router.get('/:id/observations/taxonomy/:rankid',/* auth.isAuthenticated(),*/ controller.showObservationCountAsHigherTaxonomy);
router.get('/:id/observations/count',/* auth.isAuthenticated(),*/ controller.showObservationCount);
router.get('/:id/forumposts/count',/* auth.isAuthenticated(),*/ controller.showForumCount);
router.get('/:id/images/count',/* auth.isAuthenticated(),*/ controller.showImageCount);
router.get('/:id/species/count',/* auth.isAuthenticated(),*/ controller.showSpeciesCount);
router.get('/:id/countries/count',/* auth.isAuthenticated(),*/ controller.showCountryCount);

router.get('/:id/fieldtrips', auth.isAuthenticated(), controller.showFieldTrips);


router.put('/:id/photopermission', auth.hasRole('useradmin'), controller.changePhotopermission);

//router.post('/forgot',  controller.forgot);

router.post('/',auth.hasRole('useradmin'),  controller.create);

router.post('/validate/email',  controller.validateEmail);
router.post('/validate/initials',  controller.validateInitials);

router.get('/pending/:token', redisClient.use(), controller.getPendingUser);

module.exports = router;
