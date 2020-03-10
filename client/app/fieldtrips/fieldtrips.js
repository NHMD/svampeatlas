'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('fieldtrips', {
		parent: 'localization',  
		  
        url: '/fieldtrips',
        templateUrl: 'app/fieldtrips/fieldtrips.html',
        controller: 'FieldTripsCtrl',
		 title: 'Danmarks Svampeatlas', 
		  
      });
  });