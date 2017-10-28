'use strict';

angular.module('svampeatlasApp')
  .controller('TaxonLogCtrl',['$scope','TaxonLog',  function ($scope, TaxonLog) {


	    $scope.displayed = [];

	    $scope.callServer = function(tableState) {

	      $scope.isLoading = true;

	      var pagination = tableState.pagination;

	      var offset = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
	      var limit = pagination.number || 50;  // Number of entries showed per page.
		  
		  
		  var where = (tableState.search.predicateObject) ? _.mapValues(_.omit(tableState.search.predicateObject, 'User', 'Taxon'), function(value, key){
			  
			  return {like : "%"+ value + "%"};
		  }) : undefined;
		  
		  var order = tableState.sort.predicate;
		  if(tableState.sort.reverse) {
		  	order += " DESC"
		  };
		  
		  var query = {order: order, offset:offset, limit: limit};
		  if(where) {
			  query['where']= JSON.stringify(where)
		  };
		  
		  var userWhere = (tableState.search.predicateObject && tableState.search.predicateObject.User) ? _.mapValues(tableState.search.predicateObject.User, function(value, key){
			  
			  return {like : value + "%"};
		  }) : undefined;
		  
		  var taxonWhere = (tableState.search.predicateObject && tableState.search.predicateObject.Taxon) ? _.mapValues(tableState.search.predicateObject.Taxon, function(value, key){
			  
			  return {like : "%" +value + "%"};
		  }) : undefined;
		  
		  //If we are on the taxon page, filter log to chosen taxon
		  if($scope.taxon){
		  	taxonWhere = _.merge({}, taxonWhere, {_id : $scope.taxon._id});
		  };
		   
  		query.include = JSON.stringify([{
				model: "User",
				as: "User",
			where: JSON.stringify(userWhere)
			}, {
				model: "Taxon",
				as: "Taxon",
			where: JSON.stringify(taxonWhere)
			}]);
		  
	      TaxonLog.query(query, function (result, headers) {
	        $scope.displayed = result;
	      	 tableState.pagination.numberOfPages = Math.ceil(headers('count') / limit);//set the number of pages so the pagination can update
	        $scope.isLoading = false;
	      } );
	    };



  }])
.filter('formatIndexFungorumEvent', function() {
	return function(description){
		  var r = /\d+/g;
		  var m;
		  var formatted = description;
	
		  
		  var funids = description.match(r);
		  

		  for(var i=0; i< funids.length; i++){
		  	
			formatted =  formatted.replace(": "+funids[i], ": <a href='http://www.indexfungorum.org/Names/NamesRecord.asp?RecordID="+funids[i]+"' target='_BLANK'>"+funids[i]+"</a>")
			
		  }

		  return formatted;
	  }
})