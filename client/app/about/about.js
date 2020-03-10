'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('about', {
		parent: 'localization',  
	
        url: '/about',
        templateUrl: 'app/about/about.html',
        controller: 'AboutCtrl',
		title: 'Danmarks Svampeatlas',
		  
      });
  });