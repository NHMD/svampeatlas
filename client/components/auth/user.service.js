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
    setLanguage: {
      method: 'PUT',
      params: {
        id:'me',
		controller:'language'
      }
    },
    setEmail: {
      method: 'PUT',
      params: {
        id:'me',
		controller:'email'
      }
    },
    getFirstFindings: {
      method: 'GET',
		params: {
			id: '@_id',
			roleid: '@_year'
		},
		url: '/api/users/:id/firstfindings/:year',
		isArray: true
    },
    getSpeciesCount: {
      method: 'GET',
		params: {
			id: '@_id'
		},
		url: '/api/users/:id/species/count',
		isArray: true
    },
    getObservationCount: {
      method: 'GET',
		params: {
			id: '@_id'
		},
		url: '/api/users/:id/observations/count',
		isArray: true
    },
    getForumCount: {
      method: 'GET',
		params: {
			id: '@_id'
		},
		url: '/api/users/:id/forumposts/count',
		isArray: true
    },
    getImageCount: {
      method: 'GET',
		params: {
			id: '@_id'
		},
		url: '/api/users/:id/images/count',
		isArray: true
    },
    getCountryCount: {
      method: 'GET',
		params: {
			id: '@_id'
		},
		url: '/api/users/:id/countries/count',
		isArray: true
    },
    getTaxonomicOverview: {
      method: 'GET',
		params: {
			id: '@_id',
			rankid: '@_rankid'
		},
		url: '/api/users/:id/observations/taxonomy/:rankid',
		isArray: true
    },
    getFieldTrips: {
      method: 'GET',
		params: {
			id: '@_id'
		},
		url: '/api/users/:id/fieldtrips',
		isArray: true
    }
	  });
  });


