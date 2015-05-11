/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var models = require('../api/mysql');
var Thing = models.Thing;
var User = models.User;

var mysql = require('mysql');

var _ = require('lodash');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'splendens',
	database: 'svampeatlas'
});

Thing.sync()
  .then(function() {
    return Thing.destroy({truncate: true});
  })
  .then(function() {
    Thing.bulkCreate([{
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Karma, ' +
             'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
             'Stylus, Sass, CoffeeScript, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
             'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
             'tests alongside code. Automatic injection of scripts and ' +
             'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
             'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
             'payload, minifies your scripts/css/images, and rewrites asset ' +
             'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
             'and openshift subgenerators'
    }]);
  });

User.sync()
  .then(function() {
    User.destroy({truncate: true});
  })
  .then(function() {
	  connection.connect();
	  
	  connection.query('SELECT Password as password, Initialer, Validation, FuldNavn as name, email, "local" as provider FROM masterpersoner WHERE Password <> ""', function(err, rows, fields) {
		  if(err) throw err;
	      User.bulkCreate(rows)
	      .then(function() {
	        console.log('finished populating users');
	      }).
		  catch(function(err){
		  	console.log(JSON.stringify(err))
		  });
		
		
	  });
	  
   
  });
