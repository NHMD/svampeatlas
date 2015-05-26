'use strict';
 
angular.module('svampeatlasApp')
  .factory('IndexFungorum', function ($resource) {
    return $resource('/api/indexfungorum/:controller', {
     
    },
    {
      NameSearch: {
        method: 'GET',
        params: {
          controller:'namesearch'
        }
      }
	  },
      {
        EpithetSearch: {
          method: 'GET',
          params: {
            controller:'epithetsearch'
          }
        }
  	  });
  });
  
  
  
  
