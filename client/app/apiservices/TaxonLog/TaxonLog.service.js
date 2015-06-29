'use strict';

angular.module('svampeatlasApp')
  .factory('TaxonLog', function ($resource) {
    
    // Public API here
	  return $resource('/api/taxonlogs/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });
