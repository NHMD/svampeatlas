'use strict';

angular.module('svampeatlasApp')
  .controller('DemosCtrl',['$scope','$http', '$mdMedia', '$mdDialog',  function ($scope, $http, $mdMedia, $mdDialog) {
   
	  $scope.mdMedia = $mdMedia;
 	  
	  $scope.demos = [
		  { title: 'Hvordan man lægger fund i svampeatlas', url: 'http://quick.as/xw4zcbzvx', icon: 'ondemand_video' },
		  
		  { title: 'Hvordan man kommer med bestemmelsesforslag', url: 'http://quick.as/bp7qtngeg', icon: 'ondemand_video' },
		  
		  { title: 'Indtastning af udenlandske fund i Svampeatlas', url: 'http://quick.as/YznXs8nOz' , icon: 'ondemand_video'},
		  { title: 'Søgning i svampeatlas', url: 'https://www.facebook.com/groups/svampeatlas/permalink/10154445124923522/' , icon: 'facebook'},
		  { title: 'Rapportører og findere', url: 'https://www.facebook.com/groups/svampeatlas/permalink/10154445112068522/' , icon: 'facebook'},
		  { title: 'Angivelse af finder som ikke findes i systemet', url: 'http://quick.as/o0jrtdbzk' , icon: 'ondemand_video'},
		  { title: 'Udvidet søgning efter værtsorganisme', url: 'http://quick.as/mrzqf6gq9' , icon: 'ondemand_video'}
		  
		 
		  
		  
		  
		  
		  
		
	  ]
	

	  $scope.gotoVideo = function(item){
	  	 window.open(item.url,'_blank');
	  }
	



  }])
