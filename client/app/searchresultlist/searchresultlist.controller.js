'use strict';

angular.module('svampeatlasApp')
	.controller('SearchListCtrl', ['$scope', 'Auth','Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags','TaxonRedListData','Observation','$mdMedia','$mdDialog', 'ObservationSearchService', '$stateParams', 
		function($scope,Auth, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService, $stateParams) {
		
			if($stateParams.searchterm){
				ObservationSearchService.reset();
				var search = ObservationSearchService.getSearch();
				search.where = {};
				search.include = [{
									model: "DeterminationView",
									as: "DeterminationView",
									attributes: ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName'],
									where: {}
								}, {
									model: "User",
									as: 'PrimaryUser',
									attributes: ['email', 'Initialer', 'name'],
									where: {}
								}, {
									model: "Locality",
									as: 'Locality',
									where: {}
								},
								{
									model: "ObservationImage",
									as: 'Images',
									separate: true,
									offset: 0,
									limit: 10
								}, {
									model: "ObservationForum",
									as: 'Forum',
									separate: true,
									offset: 0,
									limit: 10

								}

							];
							if($stateParams.searchterm === "mine"){
								
									search.include[1].where= {Initialer : Auth.getCurrentUser().Initialer}
								
								
							}	else if($stateParams.searchterm === "3days"){
								
								search.where.observationDate= {gt: moment().subtract(3, 'days')}
							}	else if($stateParams.searchterm === "7days"){
								
								search.where.observationDate= {gt: moment().subtract(7, 'days')}
								
							}
					
			}
			
			$scope.getDate = function(observationDate, observationDateAccuracy){
				
				var splitted = observationDate.split(" ")[0].split("-");
				
				if(observationDateAccuracy === 'month'){
					//console.log("spl "+parseInt(splitted[1]))
					return moment.months()[parseInt(splitted[1])-1] +" "+splitted[0];
				} else if(observationDateAccuracy === 'year'){
					return splitted[0];
				} else if(observationDateAccuracy === 'invalid'){
					return "ingen dato"
				}
				
			}
			
			
			ObservationSearchService.getSearch().include.push({
					model: "ObservationImage",
					as: 'Images',
					separate: true,
					offset: 0,
					limit: 10
				});
				
				ObservationSearchService.getSearch().include.push({
									model: "ObservationForum",
									as: 'Forum',
									separate: true,
									offset: 0,
									limit: 10

								});
			
			ObservationSearchService.getSearch().include = _.map(ObservationSearchService.getSearch().include, function(n) {
							return JSON.stringify(n)
						});
			
		    $scope.showImages = function(ev, row) {
		    	var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
		    	$mdDialog.show({
		    		controller: function($scope, $mdDialog, appConstants) {
						$scope.imageurl = appConstants.imageurl;
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
						$scope.getDate = function(observationDate, observationDateAccuracy){
				
							var splitted = observationDate.split(" ")[0].split("-");
				
							if(observationDateAccuracy === 'month'){
								//console.log("spl "+parseInt(splitted[1]))
								return moment.months()[parseInt(splitted[1])-1] +" "+splitted[0];
							} else if(observationDateAccuracy === 'year'){
								return splitted[0];
							} else if(observationDateAccuracy === 'invalid'){
								return "ingen dato"
							}
				
						}
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
				if($scope.count && $scope.count < tableState.pagination.start){
					return false;
				}
				$scope.isLoading = true;

				var pagination = tableState.pagination;

				var offset = pagination.start || 0; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
				var limit = pagination.number || 500; // Number of entries showed per page.
				

				
				console.log("offset " + offset )
				console.log("count " + $scope.count )
	

				var order = tableState.sort.predicate;
				if (tableState.sort.reverse) {
					order += " DESC"
				};
				var geometry = ObservationSearchService.getSearch().geometry;
				var query = {
							order: order,
							offset: offset,
							limit: limit,
							 where: ObservationSearchService.getSearch().where || {},
							 include: JSON.stringify(ObservationSearchService.getSearch().include)
						};

				if(geometry){
					query.geometry = geometry;
				}

					//if we reset (like after a search or an order)
					if (tableState.pagination.start === 0 && lastStart <= tableState.pagination.start) {
						 Observation.query(query, function(result, headers){
							$scope.displayed = result;
							$scope.count = headers('count');
							var numPages = Math.ceil(parseInt(headers('count')) / limit);
							tableState.pagination.numberOfPages = numPages; //set the number of pages so the pagination can update
							tableState.pagination.totalItemCount = parseInt(headers('count'));
							$scope.isLoading = false;
						})
					} else if(tableState.pagination.totalItemCount > $scope.displayed.length) {
						//we load more
						Observation.query(query).$promise.then(function(result){
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

	
					} else {
						$scope.isLoading = false;
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
