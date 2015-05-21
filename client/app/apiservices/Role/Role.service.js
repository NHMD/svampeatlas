'use strict';

angular.module('svampeatlasApp')
  .factory('Role', function ($resource) {
    
    // Public API here
	  return $resource('/api/roles/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });
