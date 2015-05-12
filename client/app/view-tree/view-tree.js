  'use strict';

  angular.module('svampeatlasApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('taxonomy-tree', {
          url: '/taxonomy-tree',
           templateUrl: 'app/view-tree/view-tree.html',
          controller: 'ViewTreeCtrl'
        });
    });