'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('funindex', {
        url: '/funindex',
        templateUrl: 'app/funindex/funindex.html',
        controller: 'FunindexCtrl'
      });
  });