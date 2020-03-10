'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('adminuser', {
		parent: 'localization',  
		  
		  authenticate: function(Auth){
		  	return Auth.hasRole('validator')
		  },
        url: '/admin/user/:id',
        templateUrl: 'app/adminuser/adminuser.html',
        controller: 'AdminUserCtrl',
		  controllerAs: 'ctrl'
      });
  });