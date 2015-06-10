'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxon', {
        url: '/taxon/:id?',
        templateUrl: 'app/taxon/taxon.html',
        controller: 'TaxonCtrl'
      });
  });