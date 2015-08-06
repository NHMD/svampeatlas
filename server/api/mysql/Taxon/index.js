'use strict';

var express = require('express');
var controller = require('./Taxon.controller');
var attributesController = require('../TaxonAttributes/TaxonAttributes.controller');
var imagesController = require('../TaxonImages/TaxonImages.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/updateallsystematicsbyid', controller.updateAllSystematicsById);
router.get('/updateallsystematicsbytypificationid', controller.updateAllSystematicsByTypificationId);
router.get('/syncallfunidsbynamematch', controller.syncAllFUNIdsByNameMatch);
router.get('/updateallidsbyname/:taxonrank', controller.updateAllFUNIdsByNameMatch);
router.get('/updateallidsbynameforunacceptedspecies', controller.syncAllFUNIdsByNameMatchForNewParentSpecies);
router.get('/tree', controller.showTree);
router.get('/:id', controller.show);
router.get('/:id/updatesystematics', controller.updateSystematics);

router.post('/', auth.hasRole('taxonomyadmin'), controller.create);
router.put('/:id',auth.hasRole('taxonomyadmin'),  controller.update);
router.patch('/:id',auth.hasRole('taxonomyadmin'),  controller.update);
router.delete('/:id',auth.hasRole('taxonomyadmin'),  controller.destroy);

router.post('/:id/parent', auth.hasRole('taxonomyadmin'), controller.setParent);
router.post('/:id/synonyms',auth.hasRole('taxonomyadmin'),  controller.addSynonym);


router.get('/:id/images', imagesController.showImages);
router.post('/:id/images',auth.hasRole('taxonomyadmin'),  imagesController.addImage);
router.put('/:id/images/:imgid',auth.hasRole('taxonomyadmin'),  imagesController.updateImage);
router.delete('/:id/images/:imgid',auth.hasRole('taxonomyadmin'),  imagesController.deleteImage);

router.post('/:id/attributes',auth.hasRole('taxonomyadmin'),   attributesController.create);
router.put('/:id/attributes',auth.hasRole('taxonomyadmin'),   attributesController.update);
router.delete('/:id/attributes',auth.hasRole('taxonomyadmin'),   attributesController.destroy);




module.exports = router;
