'use strict';

angular.module('svampeatlasApp')
  .factory('MorphoGroup', function ($resource) {
    
    // Public API here
	  return $resource('/api/morphogroups/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });