/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var RedListEditions = require('../').RedListEditions;

exports.register = function(socket) {
  RedListEditions.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  RedListEditions.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  RedListEditions.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('RedListEditions:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('RedListEditions:remove', doc);
}
