'use strict';

angular.module('svampeatlasApp')
  .factory('MycokeyCharacters', function ($resource) {
    
    // Public API here
	  return $resource('/api/mycokeycharacters/:id', { id: '@_id' }, {
	      update: {
	        method: 'PUT' // this method issues a PUT request
	      },
		  getGroups:  {
				method: 'GET',
				url: '/api/mycokeycharacters/groups',
				isArray: true
			},
			queryView : {
				method: 'GET',
				url: '/api/mycokeycharacters/view',
				isArray: true
			}
	    });
   
  });
