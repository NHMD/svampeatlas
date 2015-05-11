'use strict';

angular.module('svampeatlasApp')
  .service('indexfungorum', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
  
  
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
  
  
  
  
