'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonlog', {
        url: '/taxonbase/log',
        templateUrl: 'app/taxonlog/taxonlog.html',
        controller: 'TaxonLogCtrl'
      });
  });