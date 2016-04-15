/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var locality = require('../').Locality;

exports.register = function(socket) {
  locality.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  locality.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  locality.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('locality:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('locality:remove', doc);
}
