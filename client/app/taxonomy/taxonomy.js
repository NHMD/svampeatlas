'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonomy', {
        url: '/taxonbase/search',
        templateUrl: 'app/taxonomy/taxonomy.html',
        controller: 'TaxonomyCtrl'
      });
  });