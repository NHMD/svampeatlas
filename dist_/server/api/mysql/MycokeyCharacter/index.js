'use strict';

var express = require('express');
var controller = require('./MycokeyCharacter.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();
router.get('/groups', controller.indexGroups);

router.get('/', controller.index);
router.get('/view', controller.index);

router.get('/:id', controller.show);
// router.post('/',auth.hasRole('taxonomyadmin'), controller.create);
// router.delete('/:id',auth.hasRole('taxonomyadmin'), controller.destroy);

router.post('/:id/taxa',auth.hasRole('taxonomyadmin'), controller.batchAddMycokeyCharacter);
router.delete('/:id/taxa',auth.hasRole('taxonomyadmin'), controller.batchRemoveMycokeyCharacter);

module.exports = router;
