'use strict';

angular.module('svampeatlasApp')
  .controller('FunindexCtrl',['$scope','IndexFungorum' ,function ($scope, IndexFungorum) {
   
	  $scope.searchParams = { AnywhereInText: "false", MaxNumber: 100};
 
    $scope.getDataFromFUN = function(){
		$scope.isLoading = true;
		$scope.rowCollection = undefined;
	    IndexFungorum.NameSearch($scope.searchParams).$promise.then(function(data){
	  	  $scope.rowCollection = data.NameSearchResult.NewDataSet.IndexFungorum;
		  $scope.isLoading = false;
	  //	console.log(data)
	    })
    };
  }]);
