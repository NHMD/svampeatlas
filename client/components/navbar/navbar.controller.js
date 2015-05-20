'use strict';

angular.module('svampeatlasApp')
  .controller('NavbarCtrl', function ($scope, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'state': 'main'
    },{
      'title': 'Taxonomy',
      'state': 'taxonomy'
    },{
      'title': 'View Taxon tree',
      'state': 'taxonomy-tree'
    },{
      'title': 'Funindex',
      'state': 'funindex'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.hasRole = Auth.hasRole;
    $scope.getCurrentUser = Auth.getCurrentUser;
  });
