/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var TaxonRanks = require('../').TaxonRanks;

exports.register = function(socket) {
  TaxonRanks.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  TaxonRanks.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  TaxonRanks.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('TaxonRanks:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('TaxonRanks:remove', doc);
}
