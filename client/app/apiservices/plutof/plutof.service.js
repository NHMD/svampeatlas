'use strict';
 
angular.module('svampeatlasApp')
  .factory('PlutoF', function ($resource) {
    return $resource('/api/plutof/:controller', {
     
    },
    {
      SpeciesHypothesis: {
        method: 'GET',
        params: {
          controller:'specieshypothesis'
        }
      },
      GetToken: {
        method: 'GET',
        params: {
          controller:'token'
        }
      },
   
	  
	  });
  });
  
  
  
  
