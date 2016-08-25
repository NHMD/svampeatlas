'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider



      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl',
        authenticate: function(Auth){
		  	return Auth.isLoggedIn();
		  }
      })
      .state('userstats', {
	
        url: '/userstats/:userid?',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl'
      });
 
 });