'use strict';

angular.module('svampeatlasApp')
  .controller('NavbarCtrl', function ($scope, $state, ssSideNav, $mdMedia, $mdSidenav) {
	  $scope.mdMedia = $mdMedia;
	  $scope.mdSidenav = $mdSidenav;
	  $scope.state = $state;
	  $scope.menu = ssSideNav;
$scope.states = 
    { 'admin': { name: "Useradmin", icon: 'group'},
	  'login': { name: "Login", icon: 'login'},
	  'settings': { name: "Profil", icon: 'person'},
	  'search': { name: "Søg fund", icon: 'search'},
	};
	
	$scope.openSideNav = function(){
	
			$scope.menu.userHasForceClosed = false;
	
		 $mdSidenav('left').open();
	}
	
  });
