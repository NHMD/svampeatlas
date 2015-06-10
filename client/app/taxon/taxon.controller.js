'use strict';

angular.module('svampeatlasApp')
  .controller('TaxonCtrl',['$scope','Taxon', '$stateParams', function ($scope, Taxon, $stateParams) {
   
	  if ($stateParams.id) {
	  	console.log("Found id "+ $stateParams.id)
		  $scope.taxon = Taxon.get({id: $stateParams.id});
		  console.log($scope.taxon)
	  }

	  



  }])
  

