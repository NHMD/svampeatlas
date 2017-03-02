'use strict';
angular.module('svampeatlasApp')
	.factory('TaxonBatchUpdateModalService', function($mdDialog) {

			return {
				show: function( markedTaxa) {
			      $mdDialog.show({
					locals: {markedTaxa: markedTaxa},  
			        controller: ['$scope','$mdDialog', '$mdToast','$http', '$translate', 'TaxonomyTags','MycokeyCharacters', 'ErrorHandlingService', 'SearchService',
					  				function($scope, $mdDialog,$mdToast,  $http, $translate, TaxonomyTags, MycokeyCharacters, ErrorHandlingService, SearchService) {
										$scope.actionType = "Add";
										$scope.propertyType = "Tag";
										
										
										$scope.$watch('propertyType', function(newVal, oldVal){
											
											if(newVal === 'MorphoGroup'){
												$scope.actionType = "Add";
											}
										})
										
										$scope.selectedTags = [];
										$scope.selectedMycokeyCharacters = [];
										
										
										SearchService.getMorphoGroup().then(function(morphoGroup){
											$scope.morphoGroup = morphoGroup;
								
										})
										
										$scope.tagSearch = function(query) {

											var results = query ? TaxonomyTags.query({
												where: {
													tagname: {
														like: query + "%"
													}
												},
												limit: 30
											}).$promise : [];

											return results;
										};
										
										$scope.mycokeySearch = function(query) {
											
											var where = ($translate.use() === "en") ? { 
														"description UK": {
														like: "%"+query + "%"
													} } : {
													"description DK": {
														like: "%"+query + "%"
													} };
						
											var results = query ? MycokeyCharacters.query({
												where: where,
												limit: 30
											}).$promise : [];

											return results;
										}
										
										
									  $scope.cancel = function() {
									    $mdDialog.hide()
										  .then(function(){
										  	
										   });
									  };
										
										
									  $scope.doBatchOperation = function(){
										  
										  var method = ($scope.actionType === "Add") ? "POST" : "DELETE";
										  var baseUrl;
										  var id;
										   if($scope.propertyType === "Tag") {
											   baseUrl = '/api/taxonomytags/' ;
											   id = $scope.selectedTags[0]._id
										   }
											   else if($scope.propertyType === "MycoKeyCharacter")  {
											   baseUrl =	'/api/mycokeycharacters/';
											   id = $scope.selectedMycokeyCharacters[0].CharacterID
											   } 
											   else if($scope.propertyType === "MorphoGroup"){
											   baseUrl =	'/api/morphogroups/';
											   id= $scope.selectedMorphoGroup
											   }
											    
											  $http({
											      method: method,
											      url: baseUrl+id+'/taxa',
											      data: markedTaxa,
											      headers: {'Content-Type': 'application/json;charset=utf-8'}
											  }).then(function() {
				  								
								    			  return  $mdDialog.hide();
				  								    
				  								  
  	  					  					})
											.then(function(){
			  								    $mdToast.show(
			  								      $mdToast.simple()
			  								        .textContent($translate.instant("Operation succeeded."))
			  								        .position("top right" )
			  										.parent(document.querySelectorAll('.speeddial-parent'))
			  								        .hideDelay(3000)
			  								    );
											})
											.
  	  					  					catch (function(err) {
  	  					  						ErrorHandlingService.handle500();
  	  					  					})			
										  
					  					
									  	
									  }
										
										
					  				}],
			        templateUrl: 'app/taxonomy/batch-modal.tpl.html',
			        parent: angular.element(document.body),
			       
			        clickOutsideToClose:true,
			        fullscreen: true
			      })
				}
				}
			
			
			})