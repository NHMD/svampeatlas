'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider

      .state('logout', {
		parent: 'localization',  
		  
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
		parent: 'localization',  
		  
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })

      .state('settings', {
		parent: 'localization',  
		  
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: function(Auth){
		  	return Auth.isLoggedIn();
		  }
      })
      .state('forgot', {
		parent: 'localization',  
		  
        url: '/forgot?token',

        templateUrl: 'app/account/forgot/forgot.html',
        controller: 'ForgotCtrl'
      })
      .state('confirm', {
		parent: 'localization',  
		  
        url: '/confirm?token',

        templateUrl: 'app/account/confirm/confirm.html',
        controller: 'ConfirmCtrl'
      });
  })
  .run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  });
