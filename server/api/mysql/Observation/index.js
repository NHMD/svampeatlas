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


var router = express.Router();

router.get('/', auth.appendUser(), redisClient.use(), controller.index);

router.get('/specieslist', auth.appendUser(), controller.indexSpeciesList)

router.get('/:id', auth.appendUser(), controller.show);

router.get('/:id/forum', forumController.showForumForObs);
router.post('/:id/forum', auth.isAuthenticated(), forumController.addCommentToObs);

router.post('/:id/determinations', auth.hasRole('validator'), determinationController.addDeterminationToObs); 


router.post('/:id/images', [upload.array('file'), auth.isAuthenticated(), auth.appendUser(), imageController.addImagesToObs]); 


router.get('/today/localities', redisClient.use(), localityController.localititesWithFindingsToday);

// using taxonomyadmin while testing
router.post('/', auth.hasRole('taxonomyadmin'), controller.create);
router.put('/:id',auth.hasRole('taxonomyadmin'),  controller.update);
router.patch('/:id',auth.hasRole('taxonomyadmin'),  controller.update);
router.delete('/:id',auth.hasRole('taxonomyadmin'),  controller.destroy);




module.exports = router;
