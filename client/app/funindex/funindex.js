'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('funindex', {
		parent: 'localization',  
		  
		  authenticate: function(Auth){
		  	return Auth.hasRole('taxonomyadmin')
		  },
        url: '/taxonbase/newtaxon',
        templateUrl: 'app/funindex/funindex.html',
        controller: 'FunindexCtrl',
		 title: 'Danmarks Svampeatlas', 
		  
      });
  });