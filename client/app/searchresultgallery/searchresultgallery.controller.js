'use strict';

angular.module('svampeatlasApp')
	.controller('SearchGalleryCtrl', ['$scope', '$rootScope', '$filter', 'Auth', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'Observation', '$mdMedia', '$mdDialog', 'ObservationSearchService', 'ObservationStateService', '$stateParams', '$state', 'ObservationModalService', 'ObservationFormService', 'ErrorHandlingService', 'Determination', '$cookies', 'appConstants','preloader','StoredSearch',
		function($scope, $rootScope, $filter, Auth, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService, ObservationStateService, $stateParams, $state, ObservationModalService, ObservationFormService, ErrorHandlingService, Determination, $cookies, appConstants, preloader, StoredSearch) {

			$scope.moment = moment;
			$scope.translate = $translate;
			$scope.Auth = Auth;
			$scope.currentUser = Auth.getCurrentUser();
			$scope.stItemsPrPage = 100;
			$scope.ObservationModalService = ObservationModalService;
			$scope.$state = $state;
			$scope.ObservationFormService = ObservationFormService;
			$scope.$stateParams = $stateParams;
			$scope.mdMedia = $mdMedia;
			$scope.baseUrl = appConstants.baseurl;
			
			$scope.displayed = [];
			// Only use table state for correct pagination when a row update has occurred - otherwise delete state 


			
	/*		$scope.getImageUrl = function(tile) {
				var url = appConstants.imageurl + tile.Images[0].name + ".JPG";
				
				
				return preload(url).then(function(url){
					return url;
				})
				
				
				//return appConstants.imageurl + tile.Images[0].name + ".JPG";
			} */
			
		
			$scope.getBackgroundStyle = function(tile){
				
				var url = appConstants.baseurl+appConstants.thumborUrl+"300x200/"
		
				+appConstants.baseurl+appConstants.imageurl + tile.Images[0].name + ".JPG";
		  	  
				
			    return {'background-image':  'url('+url+')', 'background-size': 'cover'};
			}


			

			if ($stateParams.searchterm || ($stateParams.locality_id && $stateParams.date) || $stateParams.taxon_id) {
				ObservationSearchService.reset();
				var search = ObservationSearchService.getSearch();
				search.wasInitiatedOutsideSearchForm = true;
				search.where = {};
				var useLichenFilter = Boolean(localStorage.getItem('use_lichen_filter'));
				if ($stateParams.searchterm === "mine") {

					search.include[1].where = {
						_id: Auth.getCurrentUser()._id
					}
					search.include[1].required = true;
					// include foreign
					search.include[2].required = false;

				} else if ($stateParams.searchterm === "today") {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.where.observationDate = $filter('date')(moment().startOf('day').toDate(), "yyyy-MM-dd", '+0200')
					
				} else if ($stateParams.searchterm === "3days") {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.where.observationDate = {
						gt: $filter('date')(moment().startOf('day').subtract(3, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}
				} else if ($stateParams.searchterm === "7days") {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.where.observationDate = {
						gt: $filter('date')(moment().startOf('day').subtract(7, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}

				} else if ($stateParams.searchterm === "needsvalidation") {
					
									search.include[0].where = {
						
										$and: [{Determination_validation: { $ne: 'Godkendt'}},{Determination_validation: { $ne: 'Afvist'}} , {Determination_score: {$lt: 80}}]
									};
					
									if(useLichenFilter) {
										search.include[0].where.lichenized = 1;
									};
					
									// remove this if we don´t want foreign sightings in default searches
									search.include[2].required = false;

					} else if ($stateParams.searchterm === "foreign") {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.include[2].required = false;
					search.where.locality_id = {"$eq":null};

				} else if ($stateParams.locality_id && $stateParams.date) {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.where.observationDate = {

						gt: $filter('date')(moment($stateParams.date).toDate(), "yyyy-MM-dd", '+0200')
					};
					search.where.locality_id = $stateParams.locality_id;
				} else if ($stateParams.taxon_id) {
					search.include[0].where.Taxon_id = $stateParams.taxon_id;


					search.include[0].where.Determination_validation = ['Godkendt', 'Valideres', 'Afventer', 'Gammelvali'];

				};

			}
			
			if(ObservationSearchService.storedSearch && !$stateParams.searchterm){
				$state.transitionTo('search-gallery', {searchid: ObservationSearchService.storedSearch._id}, {
				    location: true,
				    inherit: true,
				    relative: $state.$current,
				    notify: false
				})
				$scope.storedSearch = ObservationSearchService.storedSearch;
			}
			var storedSearchDeferred = $q.defer();
			if($stateParams.searchid){
				console.log($stateParams.searchid)
				
				StoredSearch.get({id: $stateParams.searchid}).$promise.then(function(ss){
					
					
					ObservationSearchService.reset();
					var search = ObservationSearchService.getSearch();
					var storedSearch  = JSON.parse(ss.search);
					if (!search.where) {
						search.where = {};
					}

					ObservationSearchService.convertSearchDateStrings(storedSearch)
					ObservationSearchService.uiSearchToDBquery(storedSearch,search)
					
					storedSearchDeferred.resolve();
					$scope.storedSearch = ss;
					ObservationSearchService.storedSearch = ss;
					
				})
				
				
			} else {
				$scope.search = ObservationSearchService.getSearch();

				if (_.isEmpty($scope.search)) {
					$state.go('search')
				};
				
				storedSearchDeferred.resolve();
				
			}

			$scope.getDate = function(observationDate, observationDateAccuracy) {

				var splitted = observationDate.split("T")[0].split("-");
				if(splitted.length ===3)
				{if (observationDateAccuracy === 'month') {
					//console.log("spl "+parseInt(splitted[1]))
					return moment.months()[parseInt(splitted[1]) - 1] + " " + splitted[0];
				} else if (observationDateAccuracy === 'year') {
					return splitted[0];
				} else if (observationDateAccuracy === 'invalid') {
					return "ingen dato"
				}} else {
					return "ingen dato"
				}

			}

			//$scope.search = ObservationSearchService.getSearch();
			
			
				
				$scope.isLoading = true;


				var order = ($stateParams.searchterm && $stateParams.searchterm === "mine") ? [
					['createdAt', 'DESC'],
					['_id', 'DESC']
				] : [
					['observationDate', 'DESC'],
					['_id', 'DESC']
				];


				
				
				$scope.limit = 24;
				$scope.offset = 0;
				
		
				
				$scope.loadTiles = function(limit, offset){
					var query = {
						//order: order || 'observationDate DESC',
						_order: JSON.stringify(order),
						offset: offset,
						limit: limit,
						activeThreadsOnly: $scope.search.activeThreadsOnly,
						recentlyCommented: $scope.search.recentlyCommented,
						
						where: $scope.search.where || {},
						include: JSON.stringify($scope.queryinclude)
					};
					
					if ($scope.search.selectedMonths)   {
						query.selectedMonths = $scope.search.selectedMonths.toString();
					};
					
					var geometry = $scope.search.geometry;
					if (geometry) {
						query.geometry = geometry;
					}
				

					Observation.query(query, function(result, headers) {

						$scope.totalCount = headers('count');

						
						
						/*preloader.preloadImages(result).then(
							function(missingImages){
								$scope.isLoading = false;
								$scope.displayed = $scope.displayed.concat(result);
								// returns an array of _id´s of failed images. May ne posted to server to flag missing images
							}
						) */
						
						$scope.displayed = $scope.displayed.concat(result);
						
						
						$scope.isLoading = false;
						$scope.offset = offset +limit;
					}, function(err) {
						console.log(err, status)

						if (err.status === 504) {
							ErrorHandlingService.handle504();
						}
						if (err.status === 500) {
							ErrorHandlingService.handle500();
						}
					});
				}
				
				storedSearchDeferred.promise.then(function(){
					$scope.search = angular.copy(ObservationSearchService.getSearch());
					$scope.search.include[5].required = true;

					$scope.queryinclude = _.map($scope.search.include, function(n) {
						return JSON.stringify(n);
					});
					$scope.loadTiles($scope.limit, $scope.offset);
					
				})

			



		}

	]);
