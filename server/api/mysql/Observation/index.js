'use strict';
var config = require('../../../config/environment');
var express = require('express');
var controller = require('./Observation.controller');
var forumController = require('../ObservationForum/ObservationForum.controller');
var determinationController = require('../Determination/Determination.controller');
var imageController = require('../ObservationImage/ObservationImage.controller');
var localityController = require('../Locality/Locality.controller');
var auth = require('../../../auth/auth.service');
var multer  = require('multer');
var upload = multer({ dest: config.uploaddir });
var redisClient = require('../../../components/hooks/redisClient');
var nocache = require('../../../components/hooks/nocache');


var router = express.Router();

router.get('/frontpage', redisClient.use(), controller.getObservationIdsSelectedForFrontpage); 

router.get('/newdk', redisClient.use(), controller.getObservationIdsSelectedForFrontpageAsNewDK); 


router.get('/', auth.appendUser(), redisClient.use(), controller.index);

router.get('/count',  redisClient.cache(60 * 60 * 24), controller.getCount);

router.get('/count/species',  redisClient.cache(60 * 60 * 24), controller.getSpeciesCount);

router.get('/count/users',  redisClient.cache(60 * 60 * 24), controller.getUserCount);


router.get('/specieslist', auth.appendUser(), controller.indexSpeciesList)

router.get('/:id', auth.appendUser(), nocache.noCache(), controller.show);

router.get('/:id/forum', forumController.showForumForObs);
router.post('/:id/forum', auth.isAuthenticated(), forumController.addCommentToObs);
router.get('/:id/capsule', controller.generateCapsule);

router.get('/:id/determinations', determinationController.getDeterminationsForObservation);

router.post('/:id/determinations', auth.isAuthenticated(), determinationController.addDeterminationToObs); 

router.put('/:id/primarydetermination', auth.hasRole('validator'), controller.updatePrimaryDetermination); 


router.post('/:id/images', [upload.array('file'), auth.isAuthenticated(), auth.appendUser(), imageController.addImagesToObs]); 


router.post('/:id/users', auth.isAuthenticated(), controller.addUserToObs);
router.delete('/:id/users/:userid', auth.isAuthenticated(), controller.deleteUserFromObs);

router.get('/recent/localities', /*redisClient.use(), */ localityController.localititesWithRecentFindings);

router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(),  controller.update);
//router.patch('/:id', auth.hasRole('taxonomyadmin'),  controller.update);
//router.delete('/:id',auth.hasRole('validator'),  controller.destroy);
router.delete('/:id', auth.isAuthenticated(),  controller.destroy);

router.post('/:id/notifications', auth.isAuthenticated(), controller.notifyValidator); 


router.post('/frontpage/:id',  auth.hasRole('validator'), redisClient.use(), controller.addObservationToFrontPage); 
router.get('/frontpage/:id',   redisClient.use(), controller.getObservationFromFrontPage);
router.delete('/frontpage/:id',  auth.hasRole('validator'), redisClient.use(), controller.removeObservationFromFrontPage); 

router.post('/newdk/:id',  auth.hasRole('validator'), redisClient.use(), controller.addObservationToFrontPageAsNewDK); 
router.get('/newdk/:id',   redisClient.use(), controller.getObservationFromFrontPageAsNewDK);
router.delete('/newdk/:id',  auth.hasRole('validator'), redisClient.use(), controller.removeObservationFromFrontPageAsNewDK); 






module.exports = router;
