/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var observationImage = require('../').ObservationImage;

exports.register = function(socket) {
  observationImage.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  observationImage.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  observationImage.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('observationImage:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('observationImage:remove', doc);
}
