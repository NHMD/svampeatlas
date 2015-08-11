'use strict';

angular.module('svampeatlasApp')
  .factory('NatureTypes', function ($resource) {
    
    // Public API here
	  return $resource('/api/naturetypes/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });
