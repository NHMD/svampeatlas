'use strict';

angular.module('svampeatlasApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller/:ctrlid', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
	deleteRole: {
		method: 'DELETE',
		params: {
			id: '@_id',
			roleid: '@_roleid'
		},
		url: '/api/users/:id/roles/:roleid'
	},
	addRole: {
		method: 'POST',
		params: {
			id: '@_id',
			roleid: '@_roleid'
		},
		url: '/api/users/:id/roles/:roleid'
	},
	  });
  });
