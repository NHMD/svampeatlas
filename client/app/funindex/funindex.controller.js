'use strict';

angular.module('svampeatlasApp')
.filter('parseHref', function() {

    return function(text) {
		var href = $(text).attr('href');
		//$(html).attr("target", "_blank");
		return href;
    };
})
  .controller('FunindexCtrl',['$scope','IndexFungorum', 'MycoBank','x2js' ,function ($scope, IndexFungorum, MycoBank, x2js) {
   
	  $scope.handleError = function(err){
		  $scope.errorMsg= err.status +" "+ err.statusText+" "+err.data;
		   $scope.isLoading = false;
	  }
	  
	  $scope.searchParams = { AnywhereInText: "false", MaxNumber: 100};
 
    $scope.getDataFromFUN = function(){

		$scope.rowCollection = undefined;
	    IndexFungorum.NameSearch($scope.searchParams).$promise.then(function(data){
	  	  $scope.rowCollection = data.NameSearchResult.NewDataSet.IndexFungorum;
		  $scope.isLoading = false;
	  //	console.log(data)
	    })
		.catch($scope.handleError)
    };
	
    $scope.getDataFromMycoBank = function(params){
		
		$scope.rowCollectionMycobank = undefined;
	    MycoBank.query(params).$promise.then(function(data){
			if(data.Error){
				$scope.errorMsg = "MycoBank responded with: " +data.Error.ErrorMessage;
			}
			else {
				var result = data.Results.Taxon;
			
			var x2js = new X2JS();
			for(var i=0; i< result.length; i++){
				
				angular.forEach(result[i], function(value, key){
					
					if(value.substring(0, 1) === "<"){
						var newVal = x2js.xml_str2json(value);
						if(newVal){
							result[i][key] = newVal;
						}
					}
				})
				
			}
			
	  	  $scope.rowCollectionMycobank = result;
	  };
		
		
		 $scope.isLoading = false;
	  	
	    
		}).catch( $scope.handleError)
    };
	
	$scope.getData = function(){
		$scope.isLoading = true;
		$scope.errorMsg = undefined;
		if($scope.dataSource === "IndexFungorum"){
			$scope.getDataFromFUN();
		}
		else if($scope.dataSource === "MycoBank"){
			
			var operator = ($scope.searchParams.AnywhereInText === "true") ? "CONTAINS" : "STARTSWITH";
			
			$scope.getDataFromMycoBank({ operator : operator, name: $scope.searchParams.SearchText, limit: $scope.searchParams.MaxNumber});
		}
		
	}
	
	
  }]);
