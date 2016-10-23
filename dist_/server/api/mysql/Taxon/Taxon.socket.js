/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var taxon = require('../').Taxon;

exports.register = function(socket) {
  taxon.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  taxon.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  taxon.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('taxon:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('taxon:remove', doc);
}
