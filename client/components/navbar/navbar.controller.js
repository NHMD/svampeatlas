'use strict';

angular.module('svampeatlasApp')
  .controller('NavbarCtrl', function ($scope, $state) {

	  $scope.state = $state;
	  
$scope.states = 
    { 'admin': { name: "Useradmin", icon: 'group'},
	  'login': { name: "Login", icon: 'login'},
	  'settings': { name: "Profil", icon: 'person'},
	};
	
	console.log($state.current.name);

  });
