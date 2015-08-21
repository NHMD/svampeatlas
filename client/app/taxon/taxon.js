'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonlayout-taxon', {
        url: '/taxonbase/taxon/:id?',
        templateUrl: 'app/taxon/taxon.html',
        controller: 'TaxonCtrl'
      });
  });