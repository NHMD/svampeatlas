'use strict';

var express = require('express');
var controller = require('./StoredSearch.controller');

var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/', auth.appendUser(), controller.index);

router.get('/:id', controller.show);


router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id',auth.isAuthenticated(),  controller.update);
//router.put('/:id/validation', auth.hasRole('validator'),  controller.updateValidation);
//router.patch('/:id',auth.hasRole('validator'),  controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);




module.exports = router;
