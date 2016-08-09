'use strict';
angular.module('svampeatlasApp')
	.factory('TaxonBatchUpdateModalService', function($mdDialog) {

			return {
				show: function( markedTaxa) {
			      $mdDialog.show({
					locals: {markedTaxa: markedTaxa},  
			        controller: ['$scope','$mdDialog', '$mdToast','$http', '$translate', 'TaxonomyTags','MycokeyCharacters', 'ErrorHandlingService',
					  				function($scope, $mdDialog,$mdToast,  $http, $translate, TaxonomyTags, MycokeyCharacters, ErrorHandlingService) {
										$scope.actionType = "Add";
										$scope.propertyType = "Tag";
										
										$scope.selectedTags = [];
										$scope.selectedMycokeyCharacters = [];
										
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
										  var baseUrl = ($scope.propertyType === "Tag") ? '/api/taxonomytags/' : '/api/mycokeycharacters/';
										  var id = ($scope.propertyType === "Tag") ? $scope.selectedTags[0]._id : $scope.selectedMycokeyCharacters[0].CharacterID;
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