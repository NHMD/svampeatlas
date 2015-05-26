'use strict';

 
angular.module('svampeatlasApp')
  .factory('MycoBank', function ($resource) {
    return $resource('/api/mycobank/:controller', {
     
    },
    {
      query: {
        method: 'GET',
        params: {
          controller:'search'
        },
		isArrary: false
      }
	  });
  });
  
  
  
  
