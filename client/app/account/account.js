'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider

      .state('logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        controller: function($state, Auth, ssSideNav) {
          var referrer = $state.params.referrer ||
                          $state.current.referrer ||
                          'main';
          Auth.logout();
  		
  			ssSideNav.setVisible('Logout', false);
			
			
				ssSideNav.setVisible('TaxonBase', false);
			
			
				ssSideNav.setVisible('UserAdmin', false);
			
  		
          $state.go(referrer);
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: function(Auth){
		  	return Auth.isLoggedIn();
		  }
      });
  })
  .run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  });
