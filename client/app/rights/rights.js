'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('rights', {
		parent: 'localization',  
		  
        url: '/citation',
        templateUrl: 'app/rights/rights.html',
        controller: 'RightsCtrl',
		title: 'Danmarks Svampeatlas',
		  
      });
  });