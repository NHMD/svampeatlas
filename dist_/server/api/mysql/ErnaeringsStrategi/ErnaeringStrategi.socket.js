/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ErnaeringStrategi = require('../').ErnaeringStrategi;

exports.register = function(socket) {
  ErnaeringStrategi.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  ErnaeringStrategi.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  ErnaeringStrategi.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('ErnaeringStrategi:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('ErnaeringStrategi:remove', doc);
}
