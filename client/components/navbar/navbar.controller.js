'use strict';

angular.module('svampeatlasApp')
  .controller('NavbarCtrl', function ($scope, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'state': 'main'
    },{
      'title': 'Search Index Fungorum',
      'state': 'taxonomy'
    },{
      'title': 'View Taxon tree',
      'state': 'taxonomy-tree'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
  });
