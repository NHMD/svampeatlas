'use strict';

var express = require('express');
var controller = require('./MorphoGroup.controller');


var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);

router.post('/',auth.hasRole('taxonomyadmin'), controller.create);
router.delete('/:id',auth.hasRole('taxonomyadmin'), controller.destroy);
router.put('/:id', auth.hasRole('taxonomyadmin'),  controller.update);

router.post('/:id/taxa',auth.hasRole('taxonomyadmin'), controller.batchUpdateMorphoGroup);

//router.get('/:id', controller.show);


//router.post('/', auth.hasRole('validator'), controller.create);
//router.put('/:id',auth.hasRole('validator'),  controller.update);
//router.put('/:id/validation', auth.hasRole('validator'),  controller.updateValidation);
//router.patch('/:id',auth.hasRole('validator'),  controller.update);

//router.delete('/:id',auth.hasRole('taxonomyadmin'),  controller.destroy);




module.exports = router;
