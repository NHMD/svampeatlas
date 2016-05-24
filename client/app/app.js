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
	'pascalprecht.translate',
	'leaflet-directive',
	'userAvatar',
	'ngFileUpload',
	'highcharts-ng'
])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $sceDelegateProvider, $translateProvider,$mdThemingProvider, ssSideNavSectionsProvider) {
    $urlRouterProvider
      .otherwise('/');
	  $sceDelegateProvider.resourceUrlWhitelist([
	      // Allow same origin resource loads.
	      'self',
	      // Allow loading from our assets domain.  Notice the difference between * and **.
	      'http://svampe.dk/**',
		  'https://www.facebook.com/',
		  'http://api.gbif.org/'
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
				
			ssSideNavSectionsProvider.initWithSections([
				{
				id: 'observations',
				name: 'Fund',
				type: 'heading',
					requireLogin: true,
				children: [{
				id: 'AddObservation',
				icon: 'add',
				name: 'Nyt fund',
				//state: 'admin',
				type: 'action',
				requireLogin: true,
			}]},{
				id: 'SearchAtlas',
				name: 'Søg i Svampeatlas',
				type: 'heading',
				children: [{
					id: 'Search',
					name: 'Søg fund',
					state: 'search',
					type: 'toggle',
					icon: 'search',
					pages: [{
						id: 'search_my_obs',
						name: 'Mine fund',
						state: 'search-list',
						params: {searchterm: 'mine'},
						requireLogin: true

					},{
						id: 'search_form',
						name: 'Søgeformular',
						state: 'search'

					}, {
						id: 'search_3',
						name: 'Seneste 3 dage',
						state: 'search-list',
						params: {searchterm: '3days'}

					}, {
						id: 'search_7',
						name: 'Seneste 7 dage',
						state: 'search-list',
						params: {searchterm: '7days'}

					}]
				}]
			}, 
			{
			id: 'about',
			name: 'Om svampeatlas',
			type: 'heading',
			children: [{
			id: 'news',
			icon: 'rss_feed',
			name: 'Nyheder',
			state: 'news',
			type: 'link',
			requireLogin: false,
		}]},
			
			{
				id: 'Administration',
				name: 'Administration',
				type: 'heading',
				requireRole: 'any',
				children: [{
					id: 'TaxonBase',
					name: 'TaxonBase',
					type: 'toggle',
					requireRole: 'taxonomyadmin',
					icon: 'taxonomy',
					pages: [{
						id: 'TaxonBase_search',
						name: 'Search taxa',
						state: 'taxonomy',
						requireRole: 'taxonomyadmin',

					}, {
						id: 'TaxonBase_tree',
						name: 'Taxon tree',
						state: 'taxonomy-tree',
						requireRole: 'taxonomyadmin',
					}, {
						id: 'TaxonBase_funindex',
						name: 'Add new taxon',
						state: 'funindex',
						requireRole: 'taxonomyadmin',
					}, {
						id: 'TaxonBase_Log',
						name: 'Log',
						state: 'taxonlog',
						requireRole: 'taxonomyadmin',
					}, {
						id: 'TaxonBase_tags',
						name: 'Tags',
						state: 'taxontags',
						requireRole: 'taxonomyadmin',
					}]
				}]
			}, {
				id: 'UserAdmin',
				icon: 'group',
				name: 'UserAdmin',
				state: 'admin',
				type: 'link',
				requireRole: 'useradmin',
			}, {
				id: 'Settings',
				name: 'Indstillinger',
				type: 'heading',
				requireLogin: true,
				children: [{
					id: 'Logout',
					name: 'Logout',
					state: 'logout',
					type: 'link',
					icon: 'logout',
					requireLogin: true
				}, {
					id: 'Profile',
					name: 'Profil',
					state: 'settings',
					type: 'link',
					icon: 'person',
					requireLogin: true
				}]
			}]);

	  
	
  })
  .constant("appConstants", {
         "imageurl": "/uploads/"
        
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
		
        if ($cookies.get('dyntaxatoken')) {
          config.headers.DynTaxaAuthorization =  $cookies.get('dyntaxatoken');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          (state || (state = $injector.get('$state'))).go('main', {openLogin: true});
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

  .run(function($rootScope, $state, Auth, editableOptions, editableThemes, $translate, $cookies, ngMdIconService, $http) {
	// ngMdIconService.addShape('taxonomy', '<g fill="#008"><circle cy="150" cx="33" r="31"/><circle cy="72" cx="144" r="31"/><circle cy="228" cx="144" r="31"/><circle cy="33" cx="267" r="31"/><circle cy="111" cx="267" r="31"/><circle cy="189" cx="267" r="31"/><circle cy="267" cx="267" r="31"/></g><path  d="M267,33l-123,39 123,39m0,78l-123,39 123,39m-127-195l-111,78 111,78"/> ')
	  
	  FastClick.attach(document.body);
	  
	  ngMdIconService
	  .addShape('taxonomy', '<path d="m18,16.08c-0.76,0 -1.44,0.3 -1.96,0.77l-7.13,-4.15c0.05,-0.23 0.09,-0.46 0.09,-0.7s-0.04,-0.47 -0.09,-0.7l7.05,-4.11c0.54,0.5 1.25,0.81 2.04,0.81c1.66,0 3,-1.34 3,-3s-1.34,-3 -3,-3s-3,1.34 -3,3c0,0.24 0.04,0.47 0.09,0.7l-7.05,4.11c-0.54,-0.5 -1.25,-0.81 -2.04,-0.81c-1.66,0 -3,1.34 -3,3s1.34,3 3,3l2.04,-0.81l7.12,4.16c-0.05,0.21 -0.08,0.43 -0.08,0.65c0,1.61 1.31,2.92 2.92,2.92c1.61,0 2.92,-1.31 2.92,-2.92s-1.31,-2.92 -2.92,-2.92z" />'
   +'<path d="m18,15c1.66,0 2.99,-1.34 2.99,-3s-1.33,-3 -2.99,-3c-1.66,0 -3,1.34 -3,3s1.34,3 3,3z"/>'
+'<rect id="svg_4" height="1.5" width="7" y="11" x="9" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="null" />')
            .addShape('standby', '<path d="M13 3.5h-2v10h2v-10z"/><path d="M16.56 5.94l-1.45 1.45C16.84 8.44 18 10.33 18 12.5c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 5.94C5.36 7.38 4 9.78 4 12.5c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.72-1.36-5.12-3.44-6.56z"/>')
	//  .addShape('mushroom', '<path d="m 315.56 828.85 c 19.01 -1.958 41.1 -2.543 54.718 -17.932 16.372 -19.439 15.16 -48.09 5.906 -70.44 -14.717 -37.35 -46.17 -65.24 -80.56 -84.58 -30.619 -16.636 -65.32 -25.519 -100.26 -25.03 l -0.005 -0.013 c -61.09 1.682 -121.05 32.842 -156.79 82.34 -16.28 23 -26.908 52.878 -18.586 80.82 4.489 14.02 15.507 25.343 29.954 28.765 85.28 10.849 180.46 14.597 265.62 6.07 z m -178.09 40.787 c -12.23 40.35 -22.05 68.24 -20.405 110.65 1.344 17.195 6.122 37.681 23.07 45.857 20.05 9.973 43.47 7.04 65.22 7.744 20.405 -0.223 41.597 0.595 61.01 -6.223 16.247 -8.05 24.924 -26.51 24.726 -44.11 3.961 -42.491 -8.113 -72.16 -19.942 -112.46 z" />')
	 
	 
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
          $state.go('main', {openLogin: true});
        }
      });
		
	  
	  
    });
  });
