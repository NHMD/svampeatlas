'use strict';

angular.module('svampeatlasApp')
	.controller('SearchListCtrl', ['$scope', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags','TaxonRedListData','Observation','$mdMedia','$mdDialog', 'ObservationSearchService',
		function($scope, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService) {
			
			
			
		    $scope.showImages = function(ev, row) {
		    	var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
		    	$mdDialog.show({
		    		controller: function($scope, $mdDialog) {
		    			$scope.obs = row;
						$scope.loaded = {};
						$scope.failed = {};
						$scope.imageHasLoaded = function(img){
							$scope.loaded[img] = true;
							
						};
						$scope.imageHasFailed = function(img){
							$scope.failed[img] = true;
							
						};
						$scope.cancel = function() {
						    $mdDialog.cancel();
						  };
		    			
		    			
		    		},
		    		templateUrl: 'app/searchresultlist/image.tpl.html',
		    		parent: angular.element(document.body),
		    		targetEvent: ev,
		    		clickOutsideToClose: true,
		    		fullscreen: useFullScreen
		    	})
	

		    	$scope.$watch(function() {
		    		return $mdMedia('xs') || $mdMedia('sm');
		    	}, function(wantsFullScreen) {
		    		$scope.customFullscreen = (wantsFullScreen === true);
		    	});
		    };
			
		    $scope.showForum = function(ev, row) {
		    	var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
		    	$mdDialog.show({
		    		controller: function($scope, $mdDialog, Observation) {
						$scope.forum = Observation.getForum({id: row._id});
		    			$scope.obs = row;
						$scope.cancel = function() {
						    $mdDialog.cancel();
						  };
		    			
		    			
		    		},
		    		templateUrl: 'app/searchresultlist/forum.tpl.html',
		    		parent: angular.element(document.body),
		    		targetEvent: ev,
		    		clickOutsideToClose: true,
		    		fullscreen: useFullScreen
		    	})
	

		    	$scope.$watch(function() {
		    		return $mdMedia('xs') || $mdMedia('sm');
		    	}, function(wantsFullScreen) {
		    		$scope.customFullscreen = (wantsFullScreen === true);
		    	});
		    };

			
			
			$scope.mdMedia = $mdMedia;
			
			var lastStart = 0;
			            var maxNodes = 1000;

			$scope.callServer = function(tableState) {

				$scope.isLoading = true;

				var pagination = tableState.pagination;

				var offset = pagination.start || 0; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
				var limit = pagination.number || 500; // Number of entries showed per page.
			
				
	

				var order = tableState.sort.predicate;
				if (tableState.sort.reverse) {
					order += " DESC"
				};

				var query = {
					order: order,
					offset: offset,
					limit: limit
				};



					//if we reset (like after a search or an order)
					if (tableState.pagination.start === 0) {
						 Observation.query({
							order: order,
							offset: offset,
							limit: limit,
							 where: ObservationSearchService.getSearch().where || {},
							 include: JSON.stringify(ObservationSearchService.getSearch().include)
						}).$promise.then(function(result){
							$scope.displayed = result;
							$scope.isLoading = false;
						})
					} else {
						//we load more
						Observation.query({
							order: order,
							offset: offset,
							limit: limit,
							where: ObservationSearchService.getSearch().where || {},
							 include: JSON.stringify(ObservationSearchService.getSearch().include)
						}).$promise.then(function(result){
							console.log("dataset length: "+$scope.displayed.length)
							//remove first nodes if needed
							if(lastStart < tableState.pagination.start){
								$scope.displayed = $scope.displayed.concat(result);
		//remove first nodes if needed
		                        if (lastStart < tableState.pagination.start && $scope.displayed.length > maxNodes) {
		                            //remove the first nodes
		                            $scope.displayed.splice(0, 500);
		                        }
							} else {
								$scope.displayed = result.concat($scope.displayed);
		                        if (lastStart > tableState.pagination.start && $scope.displayed.length > maxNodes) {
		                            //remove the first nodes
		                            $scope.displayed.splice(($scope.displayed.length -500), 500);
		                        }
							}
							
							
							lastStart = tableState.pagination.start;

							$scope.isLoading = false;
						});

	
					}

					
				

				/*
				Observation.query({
					order: order,
					offset: offset,
					limit: limit,
					where: ObservationSearchService.getSearch().where || {}
				}, function(result, headers) {

					$scope.taxonCount = headers('count');

					var numPages = Math.ceil(headers('count') / limit);
					tableState.pagination.numberOfPages = numPages; //set the number of pages so the pagination can update
					tableState.pagination.totalItemCount = headers('count');
					

					$scope.paginationPages = (tableState.pagination.numberOfPages < 5) ? tableState.pagination.numberOfPages : 5;


					$scope.displayed = result;
					$scope.isLoading = false;
				});
				*/
			};



		}
	]);
