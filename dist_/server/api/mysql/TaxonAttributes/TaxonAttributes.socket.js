/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var taxonAttributes = require('../').TaxonAttributes;

exports.register = function(socket) {
  taxonAttributes.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  taxonAttributes.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  taxonAttributes.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('taxonAttributes:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('taxonAttributes:remove', doc);
}
