'use strict';

angular.module('svampeatlasApp')
  .factory('TaxonRedListData', function ($resource) {
    
    // Public API here
	  return $resource('/api/taxonredlistdata/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      }
	    });
   
  });
