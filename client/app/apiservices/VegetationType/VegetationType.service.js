'use strict';

angular.module('svampeatlasApp')
  .factory('VegetationType', function ($resource) {
    
    // Public API here
	  return $resource('/api/vegetationtypes/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });
