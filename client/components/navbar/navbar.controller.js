'use strict';

angular.module('svampeatlasApp')
  .controller('NavbarCtrl', function ($scope, Auth, $state) {
    $scope.menu = [{
      'title': 'Home',
      'state': 'main'
    }];
	
	$scope.isTaxonBase = function(){
		var TaxonBaseStates = ['taxonomy','funindex', 'taxonomy-tree','taxonlayout-taxon', 'taxonlayout-taxonredlistdata', 'taxonlayout-taxonbooklayout', 'taxonlog'  ];
		
		return (_.find(TaxonBaseStates, function(s){
			return s === $state.current.name;
		})) ? "active" : "";
		
	}
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.hasRole = Auth.hasRole;
    $scope.getCurrentUser = Auth.getCurrentUser;
  });
