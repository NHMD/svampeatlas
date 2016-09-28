'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('species', {
		  
        url: '/taxon/:id',
        templateUrl: 'app/species/species.html',
        controller: 'SpeciesCtrl'
      });
  });
