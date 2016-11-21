'use strict';

angular.module('svampeatlasApp')
  .factory('DataSet', function ($resource) {
    
    // Public API here
	  return $resource('/api/dataset/:id', { id: '@_id' });
   
  });
