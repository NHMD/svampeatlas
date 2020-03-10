'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('admin', {
		parent: 'localization',  
		  
		  authenticate: function(Auth){
		  	return Auth.hasRole('useradmin')
		  },
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      });
  });
