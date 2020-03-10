'use strict';

angular.module('svampeatlasApp')
  .controller('NavbarCtrl', function ($scope, $state, ssSideNav, $mdMedia, $mdSidenav, $stateParams, $translate, User, Auth) {
	 /*
	  $scope.mdMedia = $mdMedia;
	  $scope.mdSidenav = $mdSidenav;
	  $scope.menu = ssSideNav;
	  */
	  $scope.state = $state;
	  $scope.currentUser = Auth.getCurrentUser();
  	
	  
	  if($stateParams.controller){
		  $scope.ctrlparam = $translate.instant($stateParams.controller);
	  }
	  
$scope.states = 
    { 'admin': { name: "Useradmin", icon: 'group'},
	  'adminuser': { name: "Useradmin", icon: 'settings'},
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
	  'fieldtrips': {name: "Mine feltture", icon: 'shopping_basket'},
	  'validation': {name: "Validering", icon: 'microscope'},
	  'utm': {name: "UTM felter", icon: 'grid_on'},
	  'competitions': {name: "Konkurrencer", icon: 'trophy'},
	  'signup' : {name: 'Opret brugerprofil', icon: 'person_add'},
	  'confirm' : {name: 'Opret brugerprofil', icon: 'person_add'},
	  'notifications' : {name: 'Notifikationer', icon: 'notifications_active'},
	  'forgot' : {name: 'Glemt password', icon: 'lock_open'},
	  'metrics' : {name: 'Statistik', icon: 'insert_chart'},
	  'rights' : {name: 'Betingelser for indlæg og brug af data', icon: 'copyright'},
	  'imagevision' : {name: 'Navneforslag', icon: 'camera_alt'}
	  

	  
	  
	};
	
	/*
	$scope.openSideNav = function(){
	
			$scope.menu.userHasForceClosed = false;
	
		 $mdSidenav('left').open();
	}
	*/
	
  })
  .controller('SideNavBtnCtrl', function ($rootScope, $scope, $state, ssSideNav, $mdMedia, $mdSidenav) {
	  $scope.mdMedia = $mdMedia;
	  $scope.mdSidenav = $mdSidenav;
	  $scope.state = $state;
	  $scope.menu = ssSideNav;
	
	$scope.openSideNav = function(){
		$rootScope.$broadcast('userHasOpenedMenu');
			//$scope.menu.userHasForceClosed = false;
	
		 $mdSidenav('left').open();
	}
	
  })
  ;
