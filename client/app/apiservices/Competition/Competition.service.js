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
	    });
   
  });
