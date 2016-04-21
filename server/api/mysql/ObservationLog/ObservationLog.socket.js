/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var TaxonLog = require('../').TaxonLog;

exports.register = function(socket) {
  TaxonLog.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  TaxonLog.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  TaxonLog.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('TaxonLog:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('TaxonLog:remove', doc);
}
