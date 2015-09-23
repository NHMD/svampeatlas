'use strict';

angular.module('svampeatlasApp', [
	'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
//  'btford.socket-io',
  'ui.router',
	'mgcrea.ngStrap', 
	 'smart-table',
	'xeditable',
	'xml',
	'ui.bootstrap',
	'ngMaterial',
	'LocalStorageModule'
])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $sceDelegateProvider) {
    $urlRouterProvider
      .otherwise('/');
	  $sceDelegateProvider.resourceUrlWhitelist([
	      // Allow same origin resource loads.
	      'self',
	      // Allow loading from our assets domain.  Notice the difference between * and **.
	      'http://svampe.dk/**'
	    ]);
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
	$httpProvider.interceptors.push('xmlHttpInterceptor');
	
  })
.filter('synonymsWithoutSelf', function() {
	return function(synonyms) {
		return _.filter(synonyms, function(s) {
			return s.accepted_id !== s._id;;
		});

	};
})
  .factory('authInterceptor', function($rootScope, $q, $cookieStore, $injector) {
    var state;
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function($rootScope, $state, Auth, editableOptions) {
	   editableOptions.theme = 'bs3'; // bootstrap3 theme.
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $state.go('login');
        }
      });
    });
  });
