'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxaredlisdata', {
        url: '/taxaredlisdata/:id?',
        templateUrl: 'app/taxonredlistdata/taxonredlistdata.html',
        controller: 'TaxonRedListDataCtrl'
      });
  });