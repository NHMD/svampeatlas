'use strict';

angular.module('svampeatlasApp')
  .controller('TaxonTagCtrl',['$scope','TaxonomyTags', '$mdDialog', 'Auth', function ($scope, TaxonomyTags, $mdDialog, Auth) {
	  $scope.getCurrentUser = Auth.getCurrentUser;
	  
	  $scope.addTag = function(newTag){
	  	var tag = new TaxonomyTags({tagname: newTag});
		tag.$save().then(function(){
			$scope.newTag = ""
;			 $scope.displayed = TaxonomyTags.query({include: JSON.stringify([{
		model: "User",
		as: "User"
	}])})
		})
		.catch(function(err){
			alert("an error occurred")
		})
	  };

	  $scope.deleteTag = function(tag){
		  
		var confirm = $mdDialog.confirm()
	             .title('Do you want to delete "'+tag.tagname+'"?')
	             .content('All taxa will loose this tag if you delete it.')
	             .ariaLabel('Delete tag')
	             .ok('Yes')
	             .cancel('No');
		
				 
				 
	       $mdDialog.show(confirm).then(function() {
			tag.$delete().then(function(){
   			 $scope.displayed = TaxonomyTags.query({include: JSON.stringify([{
   		model: "User",
   		as: "User"
   	}])})
			})
		.
			catch(function(err){
				alert("an error occurred")
			})
	       }, function() {
	         return false;
	       });
		   
	  	console.log(tag)
	  };
	  
   $scope.displayed = [];

   $scope.callServer = function(tableState) {

     $scope.isLoading = true;

     var pagination = tableState.pagination;

     var offset = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
     var limit = pagination.number || 50;  // Number of entries showed per page.
  
  
  var where = (tableState.search.predicateObject) ? _.mapValues(_.omit(tableState.search.predicateObject, 'User'), function(value, key){
	  
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
  

   
query.include = JSON.stringify([{
		model: "User",
		as: "User",
	where: JSON.stringify(userWhere)
	}]);
  
     TaxonomyTags.query(query, function (result, headers) {
       $scope.displayed = result;
     	 tableState.pagination.numberOfPages = Math.ceil(headers('count') / limit);//set the number of pages so the pagination can update
       $scope.isLoading = false;
     } );
   };

  }])
