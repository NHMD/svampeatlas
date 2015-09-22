'use strict';

angular.module('svampeatlasApp')
  .controller('TaxonomyCtrl',['$scope','Taxon', '$timeout', '$q', 'TaxonTypeaheadService', function ($scope, Taxon,$timeout, $q, TaxonTypeaheadService) {
   


	    $scope.displayed = [];
		var localStCheckBoxes = localStorage.getItem('taxonomy_search_checkboxes');
		$scope.checkboxes = (localStCheckBoxes) ? JSON.parse(localStCheckBoxes) : {};
      $scope.querySearch = function(query) {
		  
        var results = query ?   Taxon.query({
					where: {
						TaxonName: {
							like: query + "%"
						},
						RankID: { lt: 10000}
						}, 
					limit: 30
					
				} ).$promise : [];
		  
        return results;
      }
  
	  var higherTaxa = localStorage.getItem('taxonomy_selected_higher_taxa');
	      $scope.selectedHigherTaxa = (higherTaxa) ? JSON.parse(higherTaxa) : [];
	  
	     
	    $scope.$watchCollection('selectedHigherTaxa', function(newVal, oldVal){
			
				
				var higherTaxaAggregate = {  $or: [] };
				if(newVal.length > 0){
					higherTaxaAggregate.RankID = { $gt: 9999};
				}
				angular.forEach(newVal, function(tx){
					higherTaxaAggregate.$or.push({Path: {like: tx.Path+"%"}})
				})
				
				localStorage.setItem('taxonomy_higher_taxa_predicate', JSON.stringify(higherTaxaAggregate));
				
		    	console.log(newVal)	
			
			localStorage.setItem('taxonomy_selected_higher_taxa', JSON.stringify($scope.selectedHigherTaxa))
		$scope.callServer(JSON.parse(localStorage.taxon_search_table));	

	    })
	   
		$scope.$watch('checkboxes.acceptedTaxaOnly', function(newVal, oldVal){
			
			if(newVal !== oldVal){
			$scope.saveStateAndTriggerSearchFromCheckboxes();
			}
			
		})
		$scope.$watch('checkboxes.PresentInDK', function(newVal, oldVal){
			
			if(newVal !== oldVal){
				$scope.saveStateAndTriggerSearchFromCheckboxes();
			}
		});
		
		$scope.$watch('checkboxes.OrphantTaxa', function(newVal, oldVal){
			
			if(newVal !== oldVal){
				if(newVal === true){
					$scope.selectedHigherTaxa = [];
				};
				
				$scope.saveStateAndTriggerSearchFromCheckboxes();
			}
			
		})
		$scope.saveStateAndTriggerSearchFromCheckboxes = function(){
			localStorage.setItem('taxonomy_search_checkboxes', JSON.stringify($scope.checkboxes))
			$scope.callServer(JSON.parse(localStorage.taxon_search_table));	
		}
		
		
		

	    $scope.callServer = function(tableState) {

	      $scope.isLoading = true;

	      var pagination = tableState.pagination;

	      var offset = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
	      var limit = pagination.number || 50;  // Number of entries showed per page.
		  var where = (tableState.search.predicateObject) ? _.mapValues(_.omit(tableState.search.predicateObject, ['attributes']), function(value, key){
			  	 return {like : value += "%"};
			  		 
		  }) : undefined;
		  
		  var higerTaxaPredicate = localStorage.getItem('taxonomy_higher_taxa_predicate');
		  if(higerTaxaPredicate && where){
		  	_.merge(where, JSON.parse(higerTaxaPredicate))
		  } else {
			  where = JSON.parse(higerTaxaPredicate);
		  }
  		if($scope.checkboxes.PresentInDK){
  			_.merge(where, {PresentInDK : true});
  		};
  		if($scope.checkboxes.OrphantTaxa){
  			_.merge(where, {parent_id : null});
  		};
		
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
		   var include = [{
				model: "TaxonAttributes",
				as: "attributes",
			where: JSON.stringify(attributesWhere)
			}]; 
  		
		if($scope.checkboxes.acceptedTaxaOnly === true){
			query.acceptedTaxaOnly = true;
		}
		
			
		query.include = JSON.stringify(include);
	      Taxon.query(query, function (result, headers) {
	        $scope.displayed = result;
			$scope.taxonCount = headers('count');
			
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
