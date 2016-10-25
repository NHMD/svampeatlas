'use strict';

angular.module('svampeatlasApp')
  .factory('StoredSearch', function ($resource) {
    
    // Public API here
	  return $resource('/api/search/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });
