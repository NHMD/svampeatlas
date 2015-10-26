'use strict';

angular.module('svampeatlasApp')
  .controller('TaxonomyCtrl',['$scope','Taxon', 'Datamodel','$timeout', '$q', 'TaxonTypeaheadService','$translate', function ($scope, Taxon, Datamodel,$timeout, $q, TaxonTypeaheadService, $translate) {
 
	  
	   $scope.taxonattributes = Datamodel.get({id: 'TaxonAttributes'});
	   $scope.attributequery = {dateValue: new Date()};
	  var attConds = localStorage.getItem('taxonomy_attribute_conditions');
	    $scope.attributeConditions = (attConds) ? JSON.parse(attConds) :[];
  	  var higherTaxa = localStorage.getItem('taxonomy_selected_higher_taxa');
  	      $scope.selectedHigherTaxa = (higherTaxa) ? JSON.parse(higherTaxa) : [];
	 
  		  $scope.extendedSearchIsOn = ($scope.selectedHigherTaxa.length >0 || $scope.attributeConditions.length > 0) ? 0 : -1;
	  
	  
	  
	   $scope.getOperators = function(type){
	   	
		   if(type === 'text'){
			   return ['contains', 'starts with'];
		   }
		   else if (type === 'number' || type === 'date'){
		   	return ['equals', 'greater than', 'less than']
		   } else if (type === 'boolean'){
		   	return ['equals']
		   }
		
	   }
	   
	   $scope.getAttributeType = function(attr){
		   var type = ($scope.taxonattributes[attr]) ? $scope.taxonattributes[attr].type : undefined;
		   if(!type) {
			   return undefined;
		   }
		   if(type === "BIT(1)" || type === "TINYINT(1)"){
			   return 'boolean';
		   } else if(type === "DATETIME" || type === "TIMESTAMP"){
			   return 'date';
		   } else if(type && type.indexOf('INT') > -1){
		   		return 'number'
		   } else {
		   	return 'text'
		   }		   
	   };
	   $scope.attributeQueryIsValid = function(){
		   return $scope.attributequery.selectedAttribute !== undefined && $scope.attributequery.selectedOperator !== undefined && $scope.attributequery.value !== undefined;
	   }
	   
	   $scope.$watch('attributequery.selectedAttribute', function(newval, oldval){
		   if(newval && newval !== oldval){
		   	$scope.operators = $scope.getOperators($scope.getAttributeType(newval))
		   }
		   if($scope.getAttributeType(newval) === 'boolean'){
			   $scope.attributequery.selectedOperator = 'equals';
		   }
	   });
	   
	   $scope.addCondition = function(){
		   var cond = {};
		   if($scope.attributequery.selectedOperator === "contains"){
			   
			   cond[$scope.attributequery.selectedAttribute] = {$like: '%'+$scope.attributequery.value+'%'};
			   
		   } else if($scope.attributequery.selectedOperator === "starts with"){
			    cond[$scope.attributequery.selectedAttribute] = {$like: $scope.attributequery.value+'%'}
		   } else if($scope.attributequery.selectedOperator === "equals"){
			    cond[$scope.attributequery.selectedAttribute] = {$eq: $scope.attributequery.value}
		   } else if($scope.attributequery.selectedOperator === "greater than"){
			    cond[$scope.attributequery.selectedAttribute] = {$gt: $scope.attributequery.value}
		   } else if($scope.attributequery.selectedOperator === "less than"){
			   cond[$scope.attributequery.selectedAttribute] = {$lt: $scope.attributequery.value}
		   }
		   $scope.attributeConditions.push({readable: $scope.attributequery.selectedAttribute+" "+$scope.attributequery.selectedOperator+" "+"'"+$scope.attributequery.value+"'", dbquery : cond});
		localStorage.setItem('taxonomy_attribute_conditions', JSON.stringify($scope.attributeConditions))
		$scope.callServer(JSON.parse(localStorage.taxon_search_table));	
		   $scope.attributequery = {dateValue: new Date()};
	   }
	   
	   
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
	   
		$scope.$watchCollection('attributeConditions', function(newVal, oldVal){
			
			if(newVal){
				localStorage.setItem('taxonomy_attribute_conditions', JSON.stringify(newVal));
				$scope.callServer(JSON.parse(localStorage.taxon_search_table));	
			}
			
		});
		
		
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
		  
		  
		if($scope.checkboxes.PresentInDK === true){
			
  			attributesWhere = _.merge({}, attributesWhere, {PresentInDK : true});
  		};
		 var attConds = localStorage.getItem('taxonomy_attribute_conditions');
		 
		 if(attConds){
			 var parsedConds = JSON.parse(attConds);
			 if(!attributesWhere){
				 attributesWhere = {};
				 
			 } ;
				attributesWhere.$and =  _.map(parsedConds, function(c){
		 		return JSON.stringify(c.dbquery)
		 	});
		
			
		 	
		 }
		 
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
	        
			$scope.taxonCount = headers('count');
			
				var numPages =  Math.ceil(headers('count') / limit);
		      	 tableState.pagination.numberOfPages = numPages;//set the number of pages so the pagination can update
				 tableState.pagination.totalItemCount = headers('count');
				localStorage.setItem("taxon_search_table", JSON.stringify(tableState));
			
					$scope.paginationPages = (tableState.pagination.numberOfPages < 5) ? tableState.pagination.numberOfPages : 5;
		
				
			$scope.displayed = result;
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
