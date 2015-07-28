'use strict';

angular.module('svampeatlasApp')
  .factory('TaxonRank', function ($resource) {
    
    // Public API here
	  return $resource('/api/taxonranks/:id', { id: '@_id' });
   
  });
