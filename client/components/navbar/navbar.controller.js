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
	  'dashboard' :{name: "Dashboard", icon: "dashboard"},
	  'userstats' :{name: "Statistik", icon: "show_chart"},
	  'news': { name: "Nyheder", icon: 'rss_feed'},
	  'demos': { name: "Vejledninger", icon: 'school'},
	  'about': { name: "Projektbeskrivelse", icon: 'info_outline'},
	  'checklist': { name: "Checkliste for danske arter", icon: 'playlist_add_check'}
	};
	
	$scope.openSideNav = function(){
	
			$scope.menu.userHasForceClosed = false;
	
		 $mdSidenav('left').open();
	}
	
  });
