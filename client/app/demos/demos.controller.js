'use strict';

angular.module('svampeatlasApp')
  .controller('DemosCtrl',['$scope','$http', '$mdMedia', '$mdDialog',  function ($scope, $http, $mdMedia, $mdDialog) {
   
	  $scope.mdMedia = $mdMedia;
 	  
	  $scope.demos = [
		  { title: 'Hvordan man lægger fund i det nye Svampeatlas-system', url: 'http://quick.as/xw4zcbzvx' },
		  { title: 'Indtastning af udenlandske fund i Svampeatlas', url: 'http://quick.as/YznXs8nOz' }
		
	  ]
	

	  $scope.gotoVideo = function(item){
	  	 window.open(item.url,'_blank');
	  }
	



  }])
