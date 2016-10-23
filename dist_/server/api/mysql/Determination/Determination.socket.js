/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var determination = require('../').Determination;

exports.register = function(socket) {
  determination.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  determination.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  determination.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('determination:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('determination:remove', doc);
}
