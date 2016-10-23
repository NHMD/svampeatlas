/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var observation = require('../').Observation;

exports.register = function(socket) {
  observation.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  observation.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  observation.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('observation:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('observation:remove', doc);
}
