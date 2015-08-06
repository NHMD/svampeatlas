'use strict';

angular.module('svampeatlasApp')
  .factory('TaxonAttributes', function ($resource) {
    
    // Public API here
	  return $resource('/api/taxonattributes/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });
