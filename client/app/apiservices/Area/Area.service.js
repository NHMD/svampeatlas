'use strict';

angular.module('svampeatlasApp')
  .factory('Area', function ($resource) {
    
    // Public API here
	  return $resource('/api/areas/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      },
		geometry: {
			method: 'GET',
			params: {
				id: '@_id'
			},
			url: '/api/areas/:id/geometry'
		},
	    });
   
  });
