'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonlayout-taxonbooklayout', {
        url: '/taxonbase/taxonbooklayout/:id?',
        templateUrl: 'app/taxonbooklayout/taxonbooklayout.html',
        controller: 'TaxonBookLayoutCtrl'
      });
  });