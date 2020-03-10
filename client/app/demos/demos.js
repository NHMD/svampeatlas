'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('demos', {
		parent: 'localization',  
		  
        url: '/demos',
        templateUrl: 'app/demos/demos.html',
        controller: 'DemosCtrl',
		 title: 'Danmarks Svampeatlas', 
		  
      });
  });