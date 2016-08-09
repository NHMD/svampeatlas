'use strict';

angular.module('svampeatlasApp')
  .factory('TaxonomyTags', function ($resource) {
    
    // Public API here
	  return $resource('/api/taxonomytags/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      },
		'addTaxa': {
			method: 'POST',
			params: {
				id: '@_id'
			},
			url: '/api/taxonomytags/:id/taxa'
		}
	    });
   
  });
