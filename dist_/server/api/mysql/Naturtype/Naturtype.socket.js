/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Naturtype = require('../').Naturtype;

exports.register = function(socket) {
  Naturtype.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  Naturtype.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  Naturtype.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('Naturtype:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('Naturtype:remove', doc);
}
