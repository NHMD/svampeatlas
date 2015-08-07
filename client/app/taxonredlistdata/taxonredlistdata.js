'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonredlistdata', {
        url: '/taxonredlistdata/:id?',
        templateUrl: 'app/taxonredlistdata/taxonredlistdata.html',
        controller: 'TaxonRedListDataCtrl'
      });
  });