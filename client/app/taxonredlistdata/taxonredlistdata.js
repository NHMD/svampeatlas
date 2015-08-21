'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonlayout-taxonredlistdata', {
        url: '/taxonbase/taxonredlistdata/:id?',
        templateUrl: 'app/taxonredlistdata/taxonredlistdata.html',
        controller: 'TaxonRedListDataCtrl'
      });
  });