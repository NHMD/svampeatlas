'use strict';

angular.module('svampeatlasApp')
	.controller('SearchGalleryCtrl', ['$scope', '$rootScope', '$filter', 'Auth', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'Observation', '$mdMedia', '$mdDialog', 'ObservationSearchService', 'ObservationStateService', '$stateParams', '$state', 'ObservationModalService', 'ObservationFormService', 'ErrorHandlingService', 'Determination', '$cookies', 'appConstants','preloader',
		function($scope, $rootScope, $filter, Auth, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService, ObservationStateService, $stateParams, $state, ObservationModalService, ObservationFormService, ErrorHandlingService, Determination, $cookies, appConstants, preloader) {

			$scope.moment = moment;
			$scope.Auth = Auth;
			$scope.currentUser = Auth.getCurrentUser();
			$scope.stItemsPrPage = 100;
			$scope.ObservationModalService = ObservationModalService;
			$scope.$state = $state;
			$scope.ObservationFormService = ObservationFormService;
			$scope.$stateParams = $stateParams;
			$scope.mdMedia = $mdMedia;
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
				
				var url = appConstants.imageurl + tile.Images[0].name + ".JPG";
				
		  
				
			    return {'background-image':  'url('+url+')', 'background-size': 'cover'};
			}


			

			if ($stateParams.searchterm || ($stateParams.locality_id && $stateParams.date) || $stateParams.taxon_id) {
				ObservationSearchService.reset();
				var search = ObservationSearchService.getSearch();
				search.wasInitiatedOutsideSearchForm = true;
				search.where = {};

				if ($stateParams.searchterm === "mine") {

					search.include[1].where = {
						_id: Auth.getCurrentUser()._id
					}
					search.include[1].required = true;
					// include foreign
					search.include[2].required = false;

				} else if ($stateParams.searchterm === "today") {

					search.where.observationDate = $filter('date')(moment().startOf('day').toDate(), "yyyy-MM-dd", '+0200')
					
				} else if ($stateParams.searchterm === "3days") {

					search.where.observationDate = {
						gt: $filter('date')(moment().startOf('day').subtract(3, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}
				} else if ($stateParams.searchterm === "7days") {

					search.where.observationDate = {
						gt: $filter('date')(moment().startOf('day').subtract(7, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}

				} else if ($stateParams.searchterm === "foreign") {

					search.include[2].required = false;
					search.where.locality_id = {"$eq":null};

				} else if ($stateParams.locality_id && $stateParams.date) {
					search.where.observationDate = {

						gt: $filter('date')(moment($stateParams.date).toDate(), "yyyy-MM-dd", '+0200')
					};
					search.where.locality_id = $stateParams.locality_id;
				} else if ($stateParams.taxon_id) {
					search.include[0].where.Taxon_id = $stateParams.taxon_id;


					search.include[0].where.Determination_validation = ['Godkendt', 'Valideres', 'Afventer', 'Gammelvali'];

				};

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
			$scope.search = angular.copy(ObservationSearchService.getSearch());
			if (_.isEmpty($scope.search)) {
				$state.go('search')
			};
			$scope.search.include[5].required = true;

			$scope.queryinclude = _.map($scope.search.include, function(n) {
				return JSON.stringify(n);
			});
				
				$scope.isLoading = true;


				var order = ($stateParams.searchterm && $stateParams.searchterm === "mine") ? [
					['createdAt', 'DESC'],
					['_id', 'DESC']
				] : [
					['observationDate', 'DESC'],
					['_id', 'DESC']
				];


				var geometry = ObservationSearchService.getSearch().geometry;
				
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
						selectedMonths: $scope.search.selectedMonths,
						where: $scope.search.where || {},
						include: JSON.stringify($scope.queryinclude)
					};

					if (geometry) {
						query.geometry = geometry;
					}
				

					Observation.query(query, function(result, headers) {

						$scope.totalCount = headers('count');

						$scope.displayed = $scope.displayed.concat(result);
						
						preloader.preloadImages(result).then(
							function(missingImages){
								$scope.isLoading = false;
								// returns an array of _id´s of failed images. May ne posted to server to flag missing images
								console.log(missingImages)
							}
						)
						
						
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
				
				$scope.loadTiles($scope.limit, $scope.offset);

			



		}

	]);
