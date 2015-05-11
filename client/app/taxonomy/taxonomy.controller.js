'use strict';

angular.module('svampeatlasApp')
  .controller('TaxonomyCtrl',['$scope','IndexFungorum' ,function ($scope, IndexFungorum) {
   
	  $scope.searchParams = { AnywhereInText: "false"};
 
    $scope.getDataFromFUN = function(){
	    IndexFungorum.NameSearch($scope.searchParams).$promise.then(function(data){
	  	  $scope.rowCollection = data.NameSearchResult.NewDataSet.IndexFungorum;
	  	console.log(data)
	    })
    };
  }]);
