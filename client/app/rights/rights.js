'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('rights', {

        url: '/citation',
        templateUrl: 'app/rights/rights.html',
        controller: 'RightsCtrl',
		title: 'Danmarks Svampeatlas',
		  
      });
  });