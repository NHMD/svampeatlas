'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('species', {
		parent: 'localization',  
        url: '/taxon/:id',
        templateUrl: 'app/species/species.html',
        controller: 'SpeciesCtrl'
      });
  });
