/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var TaxonomyTag = require('../').TaxonomyTag;

exports.register = function(socket) {
  TaxonomyTag.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  TaxonomyTag.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  TaxonomyTag.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('TaxonomyTag:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('TaxonomyTag:remove', doc);
}
