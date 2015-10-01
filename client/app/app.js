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
	'ngMaterial'
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

  .run(function($rootScope, $state, Auth, editableOptions, editableThemes) {
	  editableThemes['bs3'].submitTpl =    '<md-button type="submit" class="md-icon-button  md-primary" aria-label="Save"><span class="glyphicon glyphicon-ok"></span></md-button>';
	  editableThemes['bs3'].cancelTpl =  '<md-button type="button" class="md-icon-button  md-warn" ng-click="$form.$cancel()" aria-label="Cancel"><span class="glyphicon glyphicon-remove"></span></md-button>';
	  
	  editableOptions.theme = 'bs3'; // bootstrap3 theme.

	/*  
	 editableThemes['angular-material'] = {
	    formTpl:      '<form class="editable-wrap"></form>',
	    noformTpl:    '<section layout="row"  class="editable-wrap"></section>',
	    controlsTpl:  '<md-input-container class="editable-controls" ng-class="{\'md-input-invalid\': $error}"></md-input-container>',
	    inputTpl:     '',
	    errorTpl:     '<div ng-messages="{message: $error}"><div class="editable-error" ng-message="message">{{$error}}</div></div>',
	    buttonsTpl:   '<section class="editable-buttons"></section>',
	    submitTpl:    '<md-button type="submit" class="md-raised md-primary">save</md-button>',
	    cancelTpl:    '<md-button type="button" class="md-raised md-warn" ng-click="$form.$cancel()">cancel</md-button>'
	  };
*/
	//  editableOptions.theme = 'angular-material';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $state.go('login');
        }
      });
    });
  });
