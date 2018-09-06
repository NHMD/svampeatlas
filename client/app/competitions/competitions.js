'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('competitions', {
		  title: 'Konkurrencer - Danmarks svampeatlas', 
        url: '/competitions/:controller?',
        templateUrl: 'app/competitions/competitions.html',
        controller: 'CompetitionsCtrl',
		  controllerAs: 'ctrl'
      });
  });