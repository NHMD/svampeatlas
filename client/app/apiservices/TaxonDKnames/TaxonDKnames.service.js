'use strict';

angular.module('svampeatlasApp')
  .factory('TaxonDKnames', function ($resource) {
    
    // Public API here
	  return $resource('/api/taxondknames/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });
