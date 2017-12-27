'use strict';

angular.module('svampeatlasApp')
  .controller('DemosCtrl',['$scope','$http', '$mdMedia', '$mdDialog',  function ($scope, $http, $mdMedia, $mdDialog) {
   
	  $scope.mdMedia = $mdMedia;
 	  
	  $scope.demos = [
		  { title: 'Hvordan man lægger fund i svampeatlas', url: 'https://vimeo.com/248811895', icon: 'vimeo' },
		  
		  { title: 'Hvordan man kommer med bestemmelsesforslag', url: 'https://vimeo.com/248812925', icon: 'vimeo' },
		  
		  { title: 'Indtastning af udenlandske fund i Svampeatlas', url: 'https://vimeo.com/248845618' , icon: 'vimeo'},
		  { title: 'Søgning i svampeatlas', url: 'https://www.facebook.com/groups/svampeatlas/permalink/10154445124923522/' , icon: 'facebook'},
		  { title: 'Rapportører og findere', url: 'https://www.facebook.com/groups/svampeatlas/permalink/10154445112068522/' , icon: 'facebook'},
		  { title: 'Angivelse af finder som ikke findes i systemet', url: 'https://vimeo.com/248849186' , icon: 'vimeo'},
		  { title: 'Udvidet søgning efter værtsorganisme', url: 'https://vimeo.com/248813218' , icon: 'vimeo'}
		  
		 
		  
		  
		  
		  
		  
		
	  ]
	

	  $scope.gotoVideo = function(item){
	  	 window.open(item.url,'_blank');
	  }
	



  }])
