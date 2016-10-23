'use strict';

var express = require('express');
var controller = require('./PlantTaxon.controller');

var auth = require('../../../auth/auth.service');
//var intparser = require('../../../components/hooks/parseLimitOffset');

var router = express.Router();

router.get('/', controller.index);
// router.get('/updateallsystematicsbyid', controller.updateAllSystematicsById);
// router.get('/updateallsystematicsbytypificationid', controller.updateAllSystematicsByTypificationId);
// router.get('/syncallfunidsbynamematch', controller.syncAllFUNIdsByNameMatch);
// router.get('/updateallidsbyname/:taxonrank', controller.updateAllFUNIdsByNameMatch);
// router.get('/updateallidsbynameforunacceptedspecies', controller.syncAllFUNIdsByNameMatchForNewParentSpecies);

router.get('/:id', controller.show);


router.post('/', auth.hasRole('taxonomyadmin'), controller.create);
router.put('/:id',auth.hasRole('taxonomyadmin'),  controller.update);
router.patch('/:id',auth.hasRole('taxonomyadmin'),  controller.update);
router.delete('/:id',auth.hasRole('taxonomyadmin'),  controller.destroy);



module.exports = router;
