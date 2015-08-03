/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/taxonlogs', require('./api/mysql/TaxonLog'));
  app.use('/api/taxonimages', require('./api/mysql/TaxonImages'));
  app.use('/api/taxonranks', require('./api/mysql/TaxonRanks'));
  app.use('/api/taxonredlistdata', require('./api/mysql/TaxonRedListData'));
  app.use('/api/things', require('./api/mysql/thing'));
  app.use('/api/users', require('./api/mysql/user'));
   app.use('/api/roles', require('./api/mysql/role'));
   app.use('/api/taxons', require('./api/mysql/taxon'));
  app.use('/api/indexfungorum', require('./api/soap/indexfungorum'));
  app.use('/api/mycobank', require('./api/soap/mycobank'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
