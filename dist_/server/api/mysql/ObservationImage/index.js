'use strict';

var express = require('express');
var controller = require('./ObservationImage.controller');

var auth = require('../../../auth/auth.service');
var redisClient = require('../../../components/hooks/redisClient');

var router = express.Router();

router.get('/', controller.index);

router.get('/count', redisClient.cache(60 * 60 * 24), controller.getCount);
router.get('/:id', controller.show);




//router.post('/', auth.hasRole('taxonomyadmin'), controller.create);
router.put('/:id',auth.hasRole('validator'),  controller.update);
//router.patch('/:id',auth.hasRole('taxonomyadmin'),  controller.update);
router.delete('/:id', [auth.isAuthenticated(), auth.appendUser(),  controller.destroy]);




module.exports = router;
