/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var intparser = require('./components/hooks/parseLimitOffset');
module.exports = function(app) {

	 app.use('/api/datamodels', require('./api/mysql/datamodel'));
  // Insert routes below
  app.use('/api/taxonlogs',intparser.parseLimitOffset(), require('./api/mysql/TaxonLog'));
  app.use('/api/taxonimages', require('./api/mysql/TaxonImages'));
  app.use('/api/taxonranks', require('./api/mysql/TaxonRanks'));
  app.use('/api/taxonredlistdata', require('./api/mysql/TaxonRedListData'));
//  app.use('/api/redlisteditions', require('./api/mysql/RedListEditions'));
   app.use('/api/taxonattributes', require('./api/mysql/TaxonAttributes'));
   app.use('/api/taxondknames', intparser.parseLimitOffset(), require('./api/mysql/TaxonDKnames'));
   app.use('/api/naturetypes', require('./api/mysql/Naturtype'));
   app.use('/api/nutritionstrategies', require('./api/mysql/ErnaeringsStrategi'));
    app.use('/api/taxonomytags',intparser.parseLimitOffset(), require('./api/mysql/TaxonomyTag'));
	
	 app.use('/api/mycokeycharacters',intparser.parseLimitOffset(), require('./api/mysql/MycokeyCharacter'));
	
	
	app.use('/api/observations',intparser.parseLimitOffset(), require('./api/mysql/Observation'));
//	app.use('/api/observationpoints', intparser.parseLimitOffset(),require('./api/mysql/ObservationPoint'));
	app.use('/api/determinations',intparser.parseLimitOffset(), require('./api/mysql/Determination'));
	app.use('/api/localities',intparser.parseLimitOffset(), require('./api/mysql/Locality'));
	
	
	
   
  app.use('/api/things', require('./api/mysql/thing'));
  app.use('/api/users', require('./api/mysql/user'));
   app.use('/api/roles', require('./api/mysql/Role'));
   app.use('/api/taxons', intparser.parseLimitOffset(), require('./api/mysql/Taxon'));
  app.use('/api/indexfungorum', require('./api/soap/indexfungorum'));
  app.use('/api/mycobank', require('./api/soap/mycobank'));
  //   app.use('/api/dyntaxa', require('./api/soap/dyntaxa')); // TODO if mosses are included a webservice client should de set up to query DYNTAXA 
  app.use('/api/kms', require('./api/soap/kms'));
  app.use('/api/arcgis', require('./api/soap/arcgis'));
 app.use('/api/plutof', require('./api/soap/plutof'));
  app.use('/api/geonames', require('./api/soap/geonames'));
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
