'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('funindex', {
        url: '/taxonbase/newtaxon',
        templateUrl: 'app/funindex/funindex.html',
        controller: 'FunindexCtrl'
      });
  });