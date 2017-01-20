'use strict';

angular.module('svampeatlasApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngSanitize',
		'ngMessages',
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
		'material.components.expansionPanels',
		'pascalprecht.translate',
		'leaflet-directive',
		'userAvatar',
		'ngFileUpload',
		'highcharts-ng',
		'ngCsv',
		'ivh.treeview'
	])
	.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $sceDelegateProvider, $translateProvider, $mdThemingProvider, ssSideNavSectionsProvider, $logProvider) {
		$urlRouterProvider
			.otherwise('/');
		$sceDelegateProvider.resourceUrlWhitelist([
			// Allow same origin resource loads.
			'self',
			// Allow loading from our assets domain.  Notice the difference between * and **.
			'http://svampe.dk/**',
			'https://www.facebook.com/',
			'http://api.gbif.org/',
			'http://quick.as/**'
		]);
		$logProvider.debugEnabled(false);
		$locationProvider.html5Mode(true);
		$httpProvider.interceptors.push('authInterceptor');
		$httpProvider.interceptors.push('xmlHttpInterceptor');
		$translateProvider.useSanitizeValueStrategy('escape');
		$mdThemingProvider
			.theme('default')
			.primaryPalette('blue-grey', {

			})
			.accentPalette('pink');



		ssSideNavSectionsProvider.initWithTheme($mdThemingProvider);

		ssSideNavSectionsProvider.initWithSections([{
				id: 'observations',
				name: 'Fund',
				type: 'heading',
				requireLogin: true,
				children: [{
					id: 'AddObservation',
					icon: 'add',
					name: 'Nyt fund',
					state: 'observationform',


					type: 'link',
					requireLogin: true,
				}]
			}, {
				id: 'Settings',
				name: 'Bruger',
				type: 'heading',
				requireLogin: true,
				children: [{
					id: 'Dashboard',
					name: 'Dashboard',
					state: 'dashboard',
					type: 'link',
					icon: 'dashboard',
					requireLogin: true
				}, {
					id: 'search_my_obs',
					name: 'Mine rapporteringer',
					state: 'search-list',
					type: 'link',
					icon: 'playlist_add',
					params: {
						searchterm: 'mine'
					},
					requireLogin: true

				}, 
				{
									id: 'search_my_gallery',
									name: 'Mit galleri',
									state: 'search-gallery',
									type: 'link',
									icon: 'view_comfy',
									params: {
										searchterm: 'mine'
									},
									requireLogin: true

								},
				{
					id: 'fieldtrips',
					name: 'Mine feltture',
					state: 'fieldtrips',
					type: 'link',
					icon: 'shopping_basket',
					requireLogin: true
				},{
					id: 'Settings',
					name: 'Indstillinger',
					state: 'settings',
					type: 'link',
					icon: 'settings',
					requireLogin: true
				}, {
					id: 'Logout',
					name: 'Logout',
					state: 'logout',
					type: 'link',
					icon: 'logout',
					requireLogin: true
				}]
			}, {
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
						id: 'search_form',
						name: 'Søgeformular',
						state: 'search'

					}, {
						id: 'search_today',
						name: 'I dag',
						state: 'search-list',
						params: {
							searchterm: 'today'
						}

					}, {
						id: 'search_3',
						name: 'Seneste 3 dage',
						state: 'search-list',
						params: {
							searchterm: '3days'
						}

					}, {
						id: 'search_7',
						name: 'Seneste 7 dage',
						state: 'search-list',
						params: {
							searchterm: '7days'
						}

					}, {
						id: 'search_foreign',
						name: 'Udenlandske fund',
						state: 'search-list',
						params: {
							searchterm: 'foreign'
						}

					}]
				}]
			}, {
				id: 'book',
				name: 'Svampebog',
				type: 'heading',

				children: [{
					id: 'checklist',
					icon: 'playlist_add_check',
					name: 'Danske arter',
					state: 'checklist',
					type: 'link',
					requireLogin: false,
				}, {
					id: 'classification',
					icon: 'taxonomy',
					name: 'Klassifikation',
					state: 'taxon-tree-dk',
					type: 'link',
					requireLogin: false,
				}, {
					id: 'id_circles',
					icon: 'pie_chart',
					name: 'Bestemmelshjul',
					uri: 'http://svampeatlas.dk/bestemmelseshjul.html',
					type: 'external_link',
					requireLogin: false,
				}
				/*,{
					id: 'identification',
					icon: 'microscope',
					name: 'Svampebestemmelse',
					uri: 'http://svampeatlas.dk/bestemmelseshjul.html',
					type: 'external_link',
					requireLogin: false,
				} */]
			}, {
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
				}, {
					id: 'demos',
					icon: 'school',
					name: 'Vejledninger',
					state: 'demos',
					type: 'link',
					requireLogin: false,
				}, {
					id: 'about',
					icon: 'info_outline',
					name: 'Projektbeskrivelse',
					state: 'about',
					type: 'link',
					requireLogin: false,
				}]
			},

			{
				id: 'Administration',
				name: 'Administration',
				type: 'heading',
				requireRole: ['taxonomyadmin', 'validator'],
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
			},
		]);



	})
	.constant("appConstants", {
		"imageurl": "/uploads/",
		"Fungi_id": 60212,
		"baseurl": "http://svampe.databasen.org",
		"MapBoxToken": "pk.eyJ1Ijoic3ZhbXBlYXRsYXMiLCJhIjoiY2l0ZWMzemh4MDBjYTJ4dG9iZW0yZGh2dSJ9.kZHV0dNh7o0_ifC6hWzHEQ"

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
					config.headers.PlutoFAuthorization = $cookies.get('plutoftoken');
				}

				if ($cookies.get('dyntaxatoken')) {
					config.headers.DynTaxaAuthorization = $cookies.get('dyntaxatoken');
				}
				return config;
			},

			// Intercept 401s and redirect you to login
			responseError: function(response) {
				if (response.status === 401) {
					(state || (state = $injector.get('$state'))).go('main', {
						openLogin: true
					});
					// remove any stale tokens
					$cookies.remove('token');
					return $q.reject(response);
				} else {
					return $q.reject(response);
				}
			}
		};
	})

.run(function($rootScope, $state, Auth, editableOptions, editableThemes, $translate, $cookies, ngMdIconService, $http) {
	// ngMdIconService.addShape('taxonomy', '<g fill="#008"><circle cy="150" cx="33" r="31"/><circle cy="72" cx="144" r="31"/><circle cy="228" cx="144" r="31"/><circle cy="33" cx="267" r="31"/><circle cy="111" cx="267" r="31"/><circle cy="189" cx="267" r="31"/><circle cy="267" cx="267" r="31"/></g><path  d="M267,33l-123,39 123,39m0,78l-123,39 123,39m-127-195l-111,78 111,78"/> ')
	window.fbAsyncInit = function() {
		FB.init({
			appId: '332165895643',
			xfbml: true,
			version: 'v2.7'
		});
	};

	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/da_DK/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	FastClick.attach(document.body);

	ngMdIconService
		.addShape('taxonomy', '<path d="m18,16.08c-0.76,0 -1.44,0.3 -1.96,0.77l-7.13,-4.15c0.05,-0.23 0.09,-0.46 0.09,-0.7s-0.04,-0.47 -0.09,-0.7l7.05,-4.11c0.54,0.5 1.25,0.81 2.04,0.81c1.66,0 3,-1.34 3,-3s-1.34,-3 -3,-3s-3,1.34 -3,3c0,0.24 0.04,0.47 0.09,0.7l-7.05,4.11c-0.54,-0.5 -1.25,-0.81 -2.04,-0.81c-1.66,0 -3,1.34 -3,3s1.34,3 3,3l2.04,-0.81l7.12,4.16c-0.05,0.21 -0.08,0.43 -0.08,0.65c0,1.61 1.31,2.92 2.92,2.92c1.61,0 2.92,-1.31 2.92,-2.92s-1.31,-2.92 -2.92,-2.92z" />' +
			'<path d="m18,15c1.66,0 2.99,-1.34 2.99,-3s-1.33,-3 -2.99,-3c-1.66,0 -3,1.34 -3,3s1.34,3 3,3z"/>' +
			'<rect id="svg_4" height="1.5" width="7" y="11" x="9" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="null" />')
		.addShape('standby', '<path d="M13 3.5h-2v10h2v-10z"/><path d="M16.56 5.94l-1.45 1.45C16.84 8.44 18 10.33 18 12.5c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 5.94C5.36 7.38 4 9.78 4 12.5c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.72-1.36-5.12-3.44-6.56z"/>')
		.addShape('fungus', '<path d="M12,2C5,2,2,7.5,2,10.3c0,2.9,3.3,1.3,7.8,0.8l-1.4,8.6c-0.2,1.2,0.7,2.3,2,2.3h3.2c1.2,0,2.2-1.1,2-2.3l-1.4-8.6   c4.5,0.5,7.9,2.1,7.9-0.8C22,7.5,19,2,12,2z"/>')
		.addShape('fungus-cluster', '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"'
	+' viewBox="0 0 57.7 57.7" style="enable-background:new 0 0 57.7 57.7;" xml:space="preserve">'
+	'<path class="st0" d="M42.9,28.5c-0.5-0.5-1.2-0.5-1.7-0.1c-5.4,5-8.5,9.9-10.2,13.7c1.2-11.5,8-19.6,8.1-19.7'
+	'c0.4-0.5,0.4-1.3-0.1-1.7c-0.5-0.4-1.3-0.4-1.7,0.1c-0.4,0.4-7.5,9-8.7,21.3c-0.9-4.2-1.7-10.1-1-16.4c0.1-0.7-0.4-1.3-1.1-1.3'
+	'c-0.7-0.1-1.3,0.4-1.3,1.1c-0.9,8.1,0.5,15.3,1.7,19.7c-7.6-8.3-10-21.9-10-22.1c-0.1-0.7-0.7-1.1-1.4-1c-0.7,0.1-1.1,0.7-1,1.4'
+	'c0.1,0.8,3.2,18.5,14.2,26.5c0.1,0.1,0.3,0.1,0.4,0.1c0.2,0.2,0.5,0.3,0.8,0.3c0,0,0,0,0,0c0.6,0,1.1-0.4,1.2-1'
+	'c0-0.1,1.3-9.6,11.8-19.3C43.3,29.7,43.4,29,42.9,28.5z"/>'
+'<path class="st0" d="M20.5,19.1c-0.3-2.7-2.7-4.6-5.5-4.5c-2.7,0.1-4.8,2.3-5,5c-0.1,0.6,0,0.5,0.1,1.2c0,0,0.1,1.7,2.4,1.2l6.6-1.3'
+	'C19,20.6,20.6,20.5,20.5,19.1z"/>'
+'<path class="st0" d="M31.1,22.9c0.2-2.1-1.2-4.1-3.4-4.5c-2.1-0.4-4.1,0.8-4.8,2.9c-0.2,0.5-0.1,0.4-0.2,1c0,0-0.2,1.3,1.6,1.4'
+	'l5.4,0.2C29.7,23.8,31,24,31.1,22.9z"/>'
+'<path class="st0" d="M47.3,30.4c1.6-1.4,1.8-3.9,0.5-5.6c-1.3-1.7-3.7-2.1-5.5-1c-0.4,0.3-0.4,0.2-0.8,0.6c0,0-1,0.8,0.3,2.1'
+	'l3.9,3.7C45.7,30.2,46.5,31.2,47.3,30.4z"/>'
+'<path class="st0" d="M44.5,21.8c1.6-2.1,1.2-5.3-0.8-7.1c-2-1.8-5.1-1.7-7.1,0.1c-0.5,0.4-0.4,0.4-0.8,0.9c0,0-1.1,1.3,0.9,2.5'
	+'l5.7,3.6C42.4,21.9,43.7,23,44.5,21.8z"/></svg>')
		
		.addShape('microscope', '<path  d="M9.46,6.28L11.05,9C8.47,9.26 6.5,11.41 6.5,14A5,5 0 0,0 11.5,19C13.55,19 15.31,17.77 16.08,16H13.5V14H21.5V16H19.25C18.84,17.57 17.97,18.96 16.79,20H19.5V22H3.5V20H6.21C4.55,18.53 3.5,16.39 3.5,14C3.5,10.37 5.96,7.2 9.46,6.28M12.74,2.07L13.5,3.37L14.36,2.87L17.86,8.93L14.39,10.93L10.89,4.87L11.76,4.37L11,3.07L12.74,2.07Z" />')

	editableThemes['bs3'].submitTpl = '<md-button type="submit" class="md-icon-button  md-primary" aria-label="Save"><span class="glyphicon glyphicon-ok"></span></md-button>';
	editableThemes['bs3'].cancelTpl = '<md-button type="button" class="md-icon-button  md-warn" ng-click="$form.$cancel()" aria-label="Cancel"><span class="glyphicon glyphicon-remove"></span></md-button>';

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
				$state.go('main', {
					openLogin: true
				});
			}
		});

	});

	$rootScope.$on('$stateChangeSuccess', function(event, next, nextParams, prev, prevParams) {
		$rootScope.title = next.title;
		$rootScope.previousState = prev;
		//	$rootScope.ogDescription = next.ogDescription;
		//	$rootScope.ogUrl = next.url;

	});

});
