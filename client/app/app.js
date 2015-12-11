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
	'ngMdIcons',
	//'ngMenuSidenav',
	'sasrio.angular-material-sidenav',
	'pascalprecht.translate'
])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $sceDelegateProvider, $translateProvider,$mdThemingProvider, ssSideNavSectionsProvider) {
    $urlRouterProvider
      .otherwise('/');
	  $sceDelegateProvider.resourceUrlWhitelist([
	      // Allow same origin resource loads.
	      'self',
	      // Allow loading from our assets domain.  Notice the difference between * and **.
	      'http://svampe.dk/**',
		  'https://www.facebook.com/'
	    ]);
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
	$httpProvider.interceptors.push('xmlHttpInterceptor');
	$translateProvider.useSanitizeValueStrategy('escape');
	$mdThemingProvider
                .theme('default')
                .primaryPalette('blue-grey', {
                    
                })
				.accentPalette('pink')
				;
	
	            ssSideNavSectionsProvider.initWithTheme($mdThemingProvider);
				
			
	            ssSideNavSectionsProvider.initWithSections([{
	                id: 'Administration',
	                name: 'Administration',
	                type: 'heading',
	                children: [{
						id: 'TaxonBase',
	                    name: 'TaxonBase',
	                    type: 'toggle',
						hidden: true,
						icon: 'taxonomy',
	                    pages: [{
	                        id: 'TaxonBase_search',
	                        name: 'Search taxa',
	                        state: 'taxonomy'
							
	                    }, {
	                        id: 'TaxonBase_tree',
	                        name: 'Taxon tree',
	                        state: 'taxonomy-tree'
	                     //   hidden: true
	                    }, {
	                        id: 'TaxonBase_funindex',
	                        name: 'Add new taxon',
	                        state: 'funindex'
	                    }, {
	                        id: 'TaxonBase_Log',
	                        name: 'Log',
	                        state: 'taxonlog'
	                    }, {
	                        id: 'TaxonBase_tags',
	                        name: 'Tags',
	                        state: 'taxontags'
	                    }]
	                }]
	            }, {
	                id: 'UserAdmin',
					icon: 'group',
	                name: 'UserAdmin',
	                state: 'admin',
	                type: 'link',
					hidden: true
	            }, {
	                id: 'link_2',
	                name: 'Link 2',
	                state: 'common.link2',
	                type: 'link',
					hidden: true
	            }, {
	                id: 'link_3',
	                name: 'Link 3',
	                state: 'common.link3',
	                type: 'link',
	                hidden: true
	            },  {
	                id: 'Settings',
	                name: 'Indstillinger',
	                type: 'heading',
	                children: [{
	                id: 'Logout',
	                name: 'Logout',
	                state: 'logout',
	                type: 'link',
					icon: 'logout'	
	            },{
	                id: 'Profile',
	                name: 'Profil',
	                state: 'settings',
	                type: 'link',
					icon: 'person'	
	            }]
	            }]);
	  
	
  })
.filter('synonymsWithoutSelf', function() {
	return function(synonyms) {
		return _.filter(synonyms, function(s) {
			return (s.accepted_id !== s._id) || s.accepted_id === null;
		});

	};
})
  .factory('authInterceptor', function($rootScope, $q, $cookies, $injector) {
    var state;
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = "Bearer " + $cookies.get('token');
        }
        if ($cookies.get('plutoftoken')) {
          config.headers.PlutoFAuthorization =  $cookies.get('plutoftoken');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          $cookies.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function($rootScope, $state, Auth, editableOptions, editableThemes, $translate, $cookies, ngMdIconService) {
	// ngMdIconService.addShape('taxonomy', '<g fill="#008"><circle cy="150" cx="33" r="31"/><circle cy="72" cx="144" r="31"/><circle cy="228" cx="144" r="31"/><circle cy="33" cx="267" r="31"/><circle cy="111" cx="267" r="31"/><circle cy="189" cx="267" r="31"/><circle cy="267" cx="267" r="31"/></g><path  d="M267,33l-123,39 123,39m0,78l-123,39 123,39m-127-195l-111,78 111,78"/> ')
	  ngMdIconService.addShape('taxonomy', '<path d="m18,16.08c-0.76,0 -1.44,0.3 -1.96,0.77l-7.13,-4.15c0.05,-0.23 0.09,-0.46 0.09,-0.7s-0.04,-0.47 -0.09,-0.7l7.05,-4.11c0.54,0.5 1.25,0.81 2.04,0.81c1.66,0 3,-1.34 3,-3s-1.34,-3 -3,-3s-3,1.34 -3,3c0,0.24 0.04,0.47 0.09,0.7l-7.05,4.11c-0.54,-0.5 -1.25,-0.81 -2.04,-0.81c-1.66,0 -3,1.34 -3,3s1.34,3 3,3l2.04,-0.81l7.12,4.16c-0.05,0.21 -0.08,0.43 -0.08,0.65c0,1.61 1.31,2.92 2.92,2.92c1.61,0 2.92,-1.31 2.92,-2.92s-1.31,-2.92 -2.92,-2.92z" />'
   +'<path d="m18,15c1.66,0 2.99,-1.34 2.99,-3s-1.33,-3 -2.99,-3c-1.66,0 -3,1.34 -3,3s1.34,3 3,3z"/>'
+'<rect id="svg_4" height="1.5" width="7" y="11" x="9" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="null" />');
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
		var lang = $cookies.get("preferred_language") || "dk";
		$translate.use(lang);

      Auth.isLoggedIn(function(loggedIn) {
        if (next.authenticate && !next.authenticate(Auth)) {
          $state.go('login');
        }
      });
		
	  
	  
    });
  });
