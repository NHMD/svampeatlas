/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var intparser = require('./components/hooks/parseLimitOffset');
var express = require('express');
var models = require('./api/mysql');
var _ = require('lodash')

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

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
   app.use('/api/vegetationtypes', require('./api/mysql/VegetationType'));
   app.use('/api/substrate', require('./api/mysql/Substrate'));
   app.use('/api/nutritionstrategies', require('./api/mysql/ErnaeringsStrategi'));
    app.use('/api/taxonomytags',intparser.parseLimitOffset(), require('./api/mysql/TaxonomyTag'));
	
	 app.use('/api/mycokeycharacters',intparser.parseLimitOffset(), require('./api/mysql/MycokeyCharacter'));
	
	
	app.use('/api/observations',intparser.parseLimitOffset(), require('./api/mysql/Observation'));
	app.use('/api/observationimages', intparser.parseLimitOffset(),require('./api/mysql/ObservationImage'));
	app.use('/api/determinations',intparser.parseLimitOffset(), require('./api/mysql/Determination'));
	app.use('/api/localities',intparser.parseLimitOffset(), require('./api/mysql/Locality'));
	
	
	
   
//  app.use('/api/things', require('./api/mysql/thing'));
  app.use('/api/users', require('./api/mysql/user'));
   app.use('/api/roles', require('./api/mysql/Role'));
   app.use('/api/taxa', intparser.parseLimitOffset(), require('./api/mysql/Taxon'));
   app.use('/api/planttaxa', intparser.parseLimitOffset(), require('./api/mysql/PlantTaxon'));
  app.use('/api/indexfungorum', require('./api/soap/indexfungorum'));
  app.use('/api/mycobank', require('./api/soap/mycobank'));
   app.use('/api/dyntaxa', require('./api/soap/dyntaxa'));  
  app.use('/api/kms', require('./api/soap/kms'));
  app.use('/api/arcgis', require('./api/soap/arcgis'));
 app.use('/api/plutof', require('./api/soap/plutof'));
  app.use('/api/geonames', require('./api/soap/geonames'));
  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

app.use('/uploads', express.static('../uploads'));
  // All other routes should redirect to the index.html
app.get('/userstats/:id', function (req, res) {

	  models.User.find({ where: {_id: req.params.id}, attributes: ['name', 'Initialer', 'facebook']}).then(function(user){
	  	
		 res.render('index.ejs', { url: 'http://svampe.databasen.org/userstats/'+req.params.id, type:'profile', title: 'Profil for '+user.name+" på Danmarks svampetalas", description: 'Mere info om bruger', image: '' })
		
	  }).
	  catch(function(err){
		
	  	res.send(500)
	  })

});

app.get('/observations/:id', function (req, res) {
	
	  models.Observation.find(
		  { where: {_id: req.params.id}, 
		  include : [{
					model: models.DeterminationView,
					as: "DeterminationView",
					attributes: ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName', 'Determination_user_id'],
			  include : [{model: models.TaxonAttributes, as: 'attributes'}]
				}, {
					model: models.User,
					as: 'PrimaryUser',
					//	attributes: ['email', 'Initialer', 'name'],
					required: false
				}, {
					model: models.Locality,
					as: 'Locality',
					attributes: ['_id', 'name'],
					
					required: true
				}, {
					model: models.GeoNames,
					as: 'GeoNames',
					
					required: false
				}, {
					model: models.User,
					as: 'users',
					
					required: false
				}, {
					model: models.ObservationImage,
					as: 'Images',
					
					required: false
				}]}).then(function(obs){
					console.log("#### tax "+obs.DeterminationView.Determination_taxon_id)
					console.log("#### rec "+obs.DeterminationView.Recorded_as_id)
					var taxon = (obs.DeterminationView.Taxon_vernacularname_dk) ? capitalizeFirstLetter(obs.DeterminationView.Taxon_vernacularname_dk) + " ("+obs.DeterminationView.Taxon_FullName+")" : obs.DeterminationView.Taxon_FullName;
					var date = obs.observationDate.getDate()+"/"+(obs.observationDate.getMonth()+1)+"/"+obs.observationDate.getFullYear();
	  				var loc = "";
					if(obs.Locality)  {
						loc = obs.Locality.name
					} else if(obs.GeoNames){
						loc = obs.GeoNames.name+", "+obs.GeoNames.adminName1+", "+obs.GeoNames.countryName
					};
					var img = (obs.Images.length > 0) ? 'http://svampe.databasen.org/uploads/'+obs.Images[0].name + '.JPG' : '';
					
					var desc = (obs.users.length > 1) ? "Findere: " : "Finder: ";
					
					desc += _.reduce(obs.users, function(prev, u){
						
						var usr = (prev !== "") ? ", "+u.name : u.name;
						
						return prev + usr;
					}, "")
					desc +=". ";
					
					if(obs.DeterminationView.attributes.diagnose){
						desc += (taxon+ " er en "+ lowerCaseFirstLetter(obs.DeterminationView.attributes.diagnose));
					}
					if(_.find(["RE","CR","EN","VU","NT"], function(e){return e === obs.DeterminationView.Taxon_redlist_status})){
						var tx = (obs.DeterminationView.Taxon_vernacularname_dk) ? capitalizeFirstLetter(obs.DeterminationView.Taxon_vernacularname_dk) : obs.DeterminationView.Taxon_FullName;
					desc += " "+tx + " er rødlistet i kategori "+obs.DeterminationView.Taxon_redlist_status+"."
					}
		 res.render('index.ejs', { url: 'http://svampe.databasen.org/observations/'+req.params.id, type:'article', title: taxon+", "+date+", "+loc, description: desc, image: img })
		
	  }).
	  catch(function(err){
		console.log(err)
	  	res.send(err)
	  })

});
 
app.route('/*')
  .get(function (req, res) {

	  	
		 res.render('index.ejs', { url: 'http://svampe.databasen.org/', type:'website', title: 'Danmarks officielle database for svampefund', description: 'Danmarks officielle database for svampefund. Du kan indlægge, søge og diskutere fund. Du kan også få eksperthjælp til bestemmelse af svampe.', image: 'http://svampe.databasen.org/assets/images/public/mycena_crop.jpg' })
		
	 

});
  /*
  
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
 */
};
