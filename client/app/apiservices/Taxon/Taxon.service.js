'use strict';

angular.module('svampeatlasApp')
  .factory('Taxon', function ($resource) {
    
    // Public API here
	  return $resource('/api/taxons/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      },
		  'getParents': {
		        method:'GET',
		        params: {
		         id: '@_id'
		        },
		        url: '/api/taxons/:id/parents',
		        isArray: false
		       }
	    });
   
  });
