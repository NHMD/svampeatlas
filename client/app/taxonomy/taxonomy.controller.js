'use strict';

angular.module('svampeatlasApp')
  .controller('TaxonomyCtrl',['$scope','Taxon',  function ($scope, Taxon) {
   


	    $scope.displayed = [];

	    $scope.callServer = function(tableState) {

	      $scope.isLoading = true;

	      var pagination = tableState.pagination;

	      var offset = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
	      var limit = pagination.number || 50;  // Number of entries showed per page.
		  var where = (tableState.search.predicateObject) ? _.mapValues(_.omit(tableState.search.predicateObject, 'attributes'), function(value, key){
			  
			  return {like : value += "%"};
		  }) : undefined;
		  
		 
		  
		  var order = tableState.sort.predicate;
		  if(tableState.sort.reverse) {
		  	order += " DESC"
		  };
		  
		  var query = {order: order, offset:offset, limit: limit};
		  if(where) {
			  query['where']= JSON.stringify(where)
		  };
		  
		  var attributesWhere = (tableState.search.predicateObject && tableState.search.predicateObject.attributes) ? _.mapValues(tableState.search.predicateObject.attributes, function(value, key){
			  
			  return {like : value += "%"};
		  }) : undefined;
		   
  		query.include = JSON.stringify([{
				model: "TaxonAttributes",
				as: "attributes",
			where: JSON.stringify(attributesWhere)
			}]);
		  
	      Taxon.query(query, function (result, headers) {
	        $scope.displayed = result;
	      	 tableState.pagination.numberOfPages = Math.ceil(headers('count') / limit);//set the number of pages so the pagination can update
	        $scope.isLoading = false;
	      } );
	    };



  }])
  
  .directive('stRatio',function(){
          return {
            link:function(scope, element, attr){
              var ratio=+(attr.stRatio);
            
              element.css('width',ratio+'%');
            
            }
          };
      });;
