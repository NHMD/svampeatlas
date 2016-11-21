'use strict';

var express = require('express');
var controller = require('./DataSet.controller');
var redisClient = require('../../../components/hooks/redisClient');

var router = express.Router();

router.get('/',redisClient.use(), controller.index);
//router.get('/:id', controller.show);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
