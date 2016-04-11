'use strict';

angular.module('svampeatlasApp')
  .factory('PlantTaxon', function ($resource) {
    
    // Public API here
	  return $resource('/api/planttaxa/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });
