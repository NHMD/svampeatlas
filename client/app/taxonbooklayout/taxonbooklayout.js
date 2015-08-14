'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonbooklayout', {
        url: '/taxonbooklayout/:id?',
        templateUrl: 'app/taxonbooklayout/taxonbooklayout.html',
        controller: 'TaxonBookLayoutCtrl'
      });
  });