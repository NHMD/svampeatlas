'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
	  session: process.env.APP_SECRET ||'APP_SECRET'
  },

 

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID:     process.env.FACEBOOK_ID || 'FACEBOOK_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'FACEBOOK_SECRET',
    callbackURL:  (process.env.DOMAIN || 'https://svampe.databasen.org') + '/auth/facebook/callback'
  },

  google: {
    clientID:     process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback',
	api: {
		browserkey:'browserkey',
		serverkey: 'serverkey'
	},
	maps : {
		apikey: 'apikey',
		elevation_key: 'elevation_key'
	}
  },
  geonames: 'svampeatlas',
  kms: 	{
	  login:"login", 
	  password: "password"
  },
  arcgis: {
	      'client_id': 'client_id',
	      'client_secret': 'client_secret',
  },
  
  mapbox: {
	  access_token: 'access_token'
  },
  
  redisTTL: {
	  latestredlisted: 60 * 60 * 24,
	  latestlichens: 60 * 60 * 24,
	  todayslocalities:  60 * 15,
	  countGroupedByYear: 60 * 60 * 24 * 7,
	  countGroupedByDecade: 60 * 60 * 24 * 7,
	  count: 60 * 60 * 24,
	  dataSet : 60 * 60 * 24
  },
  mail: {
	  server: 'server',
	  port: 00000,
	  address: 'address',
	  validatoraddress: 'validatoraddress',
	  password: 'password'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});