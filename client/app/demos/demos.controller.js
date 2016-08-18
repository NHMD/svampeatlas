'use strict';

angular.module('svampeatlasApp')
  .controller('DemosCtrl',['$scope','$http', '$mdMedia', '$mdDialog',  function ($scope, $http, $mdMedia, $mdDialog) {
   
	  $scope.mdMedia = $mdMedia;
 	  
	  $scope.demos = [
		  { title: 'Hvordan man lægger fund i svampeatlas', url: 'http://quick.as/xw4zcbzvx', icon: 'ondemand_video' },
		  { title: 'Indtastning af udenlandske fund i Svampeatlas', url: 'http://quick.as/YznXs8nOz' , icon: 'ondemand_video'},
		  { title: 'Søgning i svampeatlas', url: 'https://www.facebook.com/groups/svampeatlas/permalink/10154445124923522/' , icon: 'facebook'},
		  { title: 'Rapportører og findere', url: 'https://www.facebook.com/groups/svampeatlas/permalink/10154445112068522/' , icon: 'facebook'}
		  
		
	  ]
	

	  $scope.gotoVideo = function(item){
	  	 window.open(item.url,'_blank');
	  }
	



  }])
