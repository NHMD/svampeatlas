'use strict';

angular.module('svampeatlasApp')
  .controller('NavbarCtrl', function ($scope, $state, ssSideNav, $mdMedia, $mdSidenav) {
	 /*
	  $scope.mdMedia = $mdMedia;
	  $scope.mdSidenav = $mdSidenav;
	  $scope.menu = ssSideNav;
	  */
	  $scope.state = $state;
	  
	  
$scope.states = 
    { 'admin': { name: "Useradmin", icon: 'group'},
	  'login': { name: "Login", icon: 'login'},
	  'settings': { name: "Indstillinger", icon: 'settings'},
	  'dashboard' :{name: "Dashboard", icon: "dashboard"},
	  'userstats' :{name: "Profil", icon: "person"},
	  'news': { name: "Nyheder", icon: 'rss_feed'},
	  'demos': { name: "Vejledninger", icon: 'school'},
	  'about': { name: "Projektbeskrivelse", icon: 'info_outline'},
	  'checklist': { name: "Checkliste for danske arter", icon: 'playlist_add_check'},
	  'species': { name: "Artspræsentation", icon: 'fungus'},
	  'taxon-tree-dk': {name: "Klassifikation", icon: 'taxonomy'},
	  'fieldtrips': {name: "Mine feltture", icon: 'shopping_basket'}
	};
	/*
	$scope.openSideNav = function(){
	
			$scope.menu.userHasForceClosed = false;
	
		 $mdSidenav('left').open();
	}
	*/
	
  })
  .controller('SideNavBtnCtrl', function ($scope, $state, ssSideNav, $mdMedia, $mdSidenav) {
	  $scope.mdMedia = $mdMedia;
	  $scope.mdSidenav = $mdSidenav;
	  $scope.state = $state;
	  $scope.menu = ssSideNav;
	
	$scope.openSideNav = function(){
	
			$scope.menu.userHasForceClosed = false;
	
		 $mdSidenav('left').open();
	}
	
  })
  ;
