/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var TaxonImages = require('../').TaxonImages;

exports.register = function(socket) {
  TaxonImages.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  TaxonImages.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  TaxonImages.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('TaxonImages:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('TaxonImages:remove', doc);
}
