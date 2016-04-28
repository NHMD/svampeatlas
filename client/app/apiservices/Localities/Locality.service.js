'use strict';

angular.module('svampeatlasApp')
  .factory('Locality', function ($resource) {
    
    // Public API here
	  return $resource('/api/localities/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      },
		'toDay': {
			method: 'GET',
			url: '/api/observations/today/localities',
			isArray: true
		}
	    });
   
  });
