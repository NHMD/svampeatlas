'use strict';

angular.module('svampeatlasApp')
  .factory('Datamodel', function ($resource) {
    
    // Public API here
	  return $resource('/api/datamodels/:id', { id: '@_id' });
   
  });
