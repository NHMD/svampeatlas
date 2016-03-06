'use strict';
 
angular.module('svampeatlasApp')
  .factory('DynTaxa', function ($resource) {
    return $resource('/api/dyntaxa/:controller', {
     
    },
    {
	AllParentTaxa: {
			method: 'GET',
			params: {
				id: '@_id'
			},
			url: '/api/dyntaxa/classification/:id'
		},
      NameSearch: {
        method: 'GET',
        params: {
          controller:'namesearch'
        }
      },
      SynonymSearch: {
        method: 'GET',
        params: {
          controller:'synonyms'
        },
		isArray: true
      },
      NameStatuses: {
        method: 'GET',
        params: {
          controller:'statuses'
        },
		isArray: true
      },
      NameCategories: {
        method: 'GET',
        params: {
          controller:'categories'
        },
		isArray: true
      },
      GetToken: {
        method: 'GET',
        params: {
          controller:'token'
        }
      },
   
	  
	  });
  });
  
  
  
  
