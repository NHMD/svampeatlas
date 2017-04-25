'use strict';

angular.module('svampeatlasApp')
  .factory('Competition', function ($resource) {
    
    // Public API here
	  return $resource('/api/competitions/:controller/:year', { controller: '@_controller' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      },
	      get: {
	        method: 'GET',
	  		params: {
	  			controller: 'numberofobservations',
	  			year: '@_year'
	  		},
			isArray: true
	      },
	      getObservationIdsForUser: {
	        method: 'GET',
	  		params: {
	  			controller: '@_controller',
	  			year: '@_year',
				userid: '@_userid'
	  		},
			url: '/api/competitions/:controller/:year/user/:userid',
			isArray: true
	      },
	    });
   
  });



