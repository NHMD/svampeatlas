'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonomy', {
        url: '/taxonomy',
        templateUrl: 'app/taxonomy/taxonomy.html',
        controller: 'TaxonomyCtrl'
      });
  });