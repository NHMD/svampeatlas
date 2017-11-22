'use strict';

angular.module('svampeatlasApp')
  .factory('ObservationImage', function ($resource) {
    
    // Public API here
	  return $resource('/api/observationimages/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      },
		'getCount': {
			method: 'GET',
			url: '/api/observationimages/count',
			isArray: true
		}
	    });
   
  });
