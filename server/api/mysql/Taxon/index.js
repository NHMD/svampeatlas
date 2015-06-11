'use strict';

var express = require('express');
var controller = require('./Taxon.controller');
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

router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);



router.get('/:id/images', controller.showImages);
router.post('/:id/images', controller.addImage);
router.put('/:id/images/:imgid', controller.updateImage);
router.delete('/:id/images/:imgid', controller.deleteImage);




module.exports = router;
