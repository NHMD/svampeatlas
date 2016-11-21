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
	  session: process.env.APP_SECRET ||'A9OgflIzFb39b9dGo1JagLMRgpP1y1Ut9qMaSyC'
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
    clientID:     process.env.FACEBOOK_ID || '332165895643',
    clientSecret: process.env.FACEBOOK_SECRET || 'ccebcf59371b0ddb919e6b91ff138e6a',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  google: {
    clientID:     process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback',
	api: {
		browserkey:'AIzaSyBU_64f_OX0zKQTYDegHXUi6FlCX7CtdYQ',
		serverkey: 'AIzaSyCP19OgflFb39o1JagLMRgpy1b9dGUt9qM'
	}
  },
  geonames: 'svampeatlas',
  kms: 	{
	  login:"thomasstjerne", 
	  password: "splendens"
  },
  arcgis: {
	      'client_id': 'QS6ITvXQsdX4F0uE',
	      'client_secret': 'b28294483b294d778f12d6749e620387',
  },
  
  mapbox: {
	  access_token: 'pk.eyJ1Ijoic3ZhbXBlYXRsYXMiLCJhIjoiY2l0ZWMzemh4MDBjYTJ4dG9iZW0yZGh2dSJ9.kZHV0dNh7o0_ifC6hWzHEQ'
  },
  
  redisTTL: {
	  latestredlisted: 60 * 60 * 24,
	  todayslocalities:  60 * 15,
	  countGroupedByYear: 60 * 60 * 24 * 7,
	  countGroupedByDecade: 60 * 60 * 24 * 7,
	  count: 60 * 60 * 24,
	  dataSet : 60 * 60 * 24
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
