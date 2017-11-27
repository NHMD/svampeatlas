'use strict';

angular.module('svampeatlasApp')
  .controller('TaxonMorphoGroupCtrl',['$scope','MorphoGroup', '$mdDialog', 'Auth',  '$state','SearchService', function ($scope, MorphoGroup, $mdDialog, Auth, $state, SearchService) {
	  $scope.getCurrentUser = Auth.getCurrentUser;
	  $scope.$state = $state;
	  
	  $scope.viewTaxa = function(mg){
		localStorage.removeItem('taxonomy_attribute_conditions');
		localStorage.removeItem('taxonomy_selected_higher_taxa');
		localStorage.removeItem('taxonomy_higher_taxa_predicate')
		localStorage.removeItem('taxonomy_selected_tags');
		localStorage.removeItem('taxonomy_redlist_categories');
		localStorage.removeItem('taxonomy_search_checkboxes');
		localStorage.removeItem("taxon_search_table");
		localStorage.removeItem('taxonomy_selected_mycokeycharacters');
		localStorage.removeItem('taxonomy_statistics_conditions');
		  localStorage.setItem('taxonomy_morphogroups', JSON.stringify([mg._id]));
		 
		  	$state.go('taxonomy');
		  
		  
	  }
	  
	  $scope.addOrUpdateGroup = function(group){
		  
		var promise =  (group && group._id) ? MorphoGroup.update({
			id: group._id
		}, group).$promise : MorphoGroup.save(group).$promise;
		
		promise.then(function(result){
			
			if(!group._id){
				_.merge(group, result)
			}
			
			SearchService.reloadMorphoGroup();
			
		})
		
		.catch(function(err){
			alert("an error occurred")
		})
	  };


	  $scope.addGroupInTable = function(where) {
	      $scope.inserted = {
	       
	        name_dk: '',
	        name_uk: '',
			  notes: ''  
	      };
		  
		  if(where === 'start'){
			  $scope.displayed.unshift($scope.inserted);
		  } else if(where === 'end'){
		  	$scope.displayed.push($scope.inserted);
		  }
	      
	    };
		
		
	  $scope.removeGroup = function(index, group){
		  
	
		  
		var confirm = $mdDialog.confirm()
	             .title('Do you want to delete "'+group.name_dk+'"?')
	             .content('If any taxon is placed in "'+group.name_dk+'" the operation will not be permitted')
	             .ariaLabel('Delete group')
	             .ok('Yes')
	             .cancel('No');
		
				 
				 
	       $mdDialog.show(confirm).then(function() {
			group.$delete().then(function(){
   			 $scope.displayed.splice(index, 1)
			})
		.
			catch(function(err){
				alert("an error occurred - have you moved all taxa to other groups?")
			})
	       }, function() {
	         return false;
	       });
		   
	  	console.log(group)
	  };
	  
   $scope.displayed = [];

   $scope.callServer = function(tableState) {

     $scope.isLoading = true;


  
  
  var where = (tableState.search.predicateObject) ? _.mapValues(_.omit(tableState.search.predicateObject, 'User'), function(value, key){
	  
	  return {like : "%"+ value + "%"};
  }) : undefined;
  
  var order = tableState.sort.predicate;
  if(tableState.sort.reverse) {
  	order += " DESC"
  };
  
  var query = {order: order};
  if(where) {
	  query['where']= JSON.stringify(where)
  };
  

   

     MorphoGroup.query(query, function (result, headers) {
       $scope.displayed = result;
       $scope.isLoading = false;
     } );
   };

  }])
