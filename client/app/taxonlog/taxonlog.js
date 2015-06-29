'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonlog', {
        url: '/taxonlog',
        templateUrl: 'app/taxonlog/taxonlog.html',
        controller: 'TaxonLogCtrl'
      });
  });