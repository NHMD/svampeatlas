/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var TaxonRedListData = require('../').TaxonRedListData;

exports.register = function(socket) {
  TaxonRedListData.hook('afterCreate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  TaxonRedListData.hook('afterUpdate', function(doc, fields, fn) {
    onSave(socket, doc);
    fn(null);
  });
  TaxonRedListData.hook('afterDestroy', function(doc, fields, fn) {
    onRemove(socket, doc);
    fn(null);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('TaxonRedListData:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('TaxonRedListData:remove', doc);
}
