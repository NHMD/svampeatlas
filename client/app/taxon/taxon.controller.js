'use strict';

angular.module('svampeatlasApp')
  .controller('TaxonCtrl',['$scope','Taxon', '$stateParams', function ($scope, Taxon, $stateParams) {
   
	  if ($stateParams.id) {
	  	console.log("Found id "+ $stateParams.id)
		  $scope.taxon = Taxon.get({id: $stateParams.id});
		  console.log($scope.taxon)
	  }

	  
	  $scope.updateTaxon = function(){
		  console.log("Updating Taxon");
		  console.log($scope.taxon)
	  }
	  
	  
	  
	  
	  
	  $scope.isValidYear = function(year){
	  	var yearPattern = /^(19|20)\d{2}$/
		
		  if (!yearPattern.test(year) || (parseInt(year) > new Date().getFullYear())) {
		        return "You must enter a valid year";
		      }
	  }


  }])
  

