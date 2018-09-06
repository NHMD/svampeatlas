'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider



      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl',
		title: 'Danmarks Svampeatlas',
		  
        authenticate: function(Auth){
		  	return Auth.isLoggedIn();
		  }
      })
      .state('userstats', {
	
        url: '/userprofile/:userid?',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl',
		title: 'Danmarks Svampeatlas',
		  
      });
 
 });