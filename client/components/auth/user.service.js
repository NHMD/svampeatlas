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
      resetPassword: {
        method: 'POST',
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
    setPhotopermission: {
      method: 'PUT',
      params: {
        id:'@_id',
		controller:'photopermission'
      }
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
    setName: {
      method: 'PUT',
      params: {
        id:'me',
		controller:'name'
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
    },
    getMorphoGroup: {
      method: 'GET',
		params: {
			id: '@_id',
			morphogroupid: '@_morphogroupid'
		},
		url: '/api/users/:id/morphogroups/:morphogroupid'
    },
    updateMorphoGroup: {
      method: 'PUT',
		params: {
			id: '@_id',
			morphogroupid: '@_morphogroupid'
		},
		url: '/api/users/:id/morphogroups/:morphogroupid'
    },
    getMorphoGroups: {
      method: 'GET',
		params: {
			id: '@_id'
		},
		url: '/api/users/:id/morphogroups',
		isArray: true
    },
	validateEmail: {
		method: 'POST',
		url: '/api/users/validate/email'
	},
	validateInitials: {
		method: 'POST',
		url: '/api/users/validate/initials'
	},
    getPending: {
      method: 'GET',
		params: {
			id: '@_token'
		},
		url: '/api/users/pending/:token'
    },
    getFeed: {
        method: 'GET',

		url: '/api/users/me/feed',
		isArray: false
    },
    getFeedCount: {
        method: 'GET',

		url: '/api/users/me/feed/count',
		isArray: false
    },
    markFeedAsRead: {
      method: 'PUT',
		params: {
			
			observationid: '@_observationid'
		},
		url: '/api/users/me/feed/:observationid/lastread',
		isArray: false
			
    },
    stopNotifications: {
      method: 'DELETE',
		params: {
			
			observationid: '@_observationid'
		},
		url: '/api/users/me/feed/:observationid'
			
    }
	  });
  });


