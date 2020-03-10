'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('utm', {
		parent: 'localization',  
		  
		  title: 'UTM kvadrater', 
        url: '/utm',
        templateUrl: 'app/utm/utm.html',
        controller: 'UtmCtrl',
		  controllerAs: 'ctrl'
      });
  });