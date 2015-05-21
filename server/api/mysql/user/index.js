'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('useradmin'), controller.index);
router.delete('/:id', auth.hasRole('useradmin'), controller.destroy);
router.delete('/:id/roles/:roleid', auth.hasRole('useradmin'), controller.removeRole);

router.post('/:id/roles/:roleid', auth.hasRole('useradmin'), controller.addRole);

router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id',/* auth.isAuthenticated(),*/ controller.show);
router.post('/', controller.create);

module.exports = router;
