'use strict';

angular.module('svampeatlasApp')
  .factory('Substrate', function ($resource) {
    
    // Public API here
	  return $resource('/api/substrate/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });
