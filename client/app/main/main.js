'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
		  params: {
		      openLogin: null,
			  fberror: null
		    },
        url: '/',
		 title: 'Danmarks Svampeatlas', 
			
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
			controllerAs: 'Main'	
      });
  });
