/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var observationForum = require('../').ObservationForum;

exports.register = function(socket) {
  observationForum.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  observationForum.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  observationForum.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('observationForum:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('observationForum:remove', doc);
}
