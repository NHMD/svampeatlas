'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('competitions', {
		parent: 'localization',  
		  
		  title: 'Konkurrencer - Danmarks svampeatlas', 
        url: '/competitions/:controller?',
        templateUrl: 'app/competitions/competitions.html',
        controller: 'CompetitionsCtrl',
		  controllerAs: 'ctrl'
      });
  });