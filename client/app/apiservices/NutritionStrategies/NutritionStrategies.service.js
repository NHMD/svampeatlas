'use strict';

angular.module('svampeatlasApp')
  .factory('NutritionStrategies', function ($resource) {
    
    // Public API here
	  return $resource('/api/nutritionstrategies/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });
