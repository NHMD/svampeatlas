'use strict';

angular.module('svampeatlasApp')
	.controller('SearchListCtrl', ['$scope', 'Auth', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'Observation', '$mdMedia', '$mdDialog', 'ObservationSearchService', '$stateParams', '$state', 'ObservationModalService', 'ObservationFormService',
		function($scope, Auth, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService, $stateParams, $state, ObservationModalService, ObservationFormService) {
			
			$scope.Auth = Auth;
			$scope.stItemsPrPage = 100;
			$scope.ObservationModalService = ObservationModalService;

			$scope.ObservationFormService = ObservationFormService;
			
			
			if ($stateParams.searchterm || ($stateParams.locality_id && $stateParams.date)) {
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
						where: {},
						required: false
					}, {
						model: "GeoNames",
						as: 'GeoNames',
						where: {},
						required: false
					}, {
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
				if ($stateParams.searchterm === "mine") {

					search.include[1].where = {
						Initialer: Auth.getCurrentUser().Initialer
					}


				} else if ($stateParams.searchterm === "3days") {

					search.where.observationDate = {
						gt: moment().subtract(3, 'days')
					}
				} else if ($stateParams.searchterm === "7days") {

					search.where.observationDate = {
						gt: moment().subtract(7, 'days')
					}

				} else if($stateParams.locality_id && $stateParams.date){
					search.where.observationDate = {
						gt: moment($stateParams.date).subtract(1, 'days')
					};
					search.where.locality_id = $stateParams.locality_id;
			};

			}

			$scope.getDate = function(observationDate, observationDateAccuracy) {

				var splitted = observationDate.split(" ")[0].split("-");

				if (observationDateAccuracy === 'month') {
					//console.log("spl "+parseInt(splitted[1]))
					return moment.months()[parseInt(splitted[1]) - 1] + " " + splitted[0];
				} else if (observationDateAccuracy === 'year') {
					return splitted[0];
				} else if (observationDateAccuracy === 'invalid') {
					return "ingen dato"
				}

			}

			$scope.search = ObservationSearchService.getSearch();

			if (_.isEmpty($scope.search)) {
				$state.go('search')
			};
			// if we came directly from the map view, remove images and forum from include
			$scope.search.include = $scope.search.include.slice(0, 4);
			$scope.search.include[0].attributes = ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName'],
			$scope.search.include[1].attributes = ['email', 'Initialer', 'name'];
			$scope.search.include.push({
				model: "ObservationImage",
				as: 'Images',
				separate: true,
				offset: 0,
				limit: 10
			});

			$scope.search.include.push({
				model: "ObservationForum",
				as: 'Forum',
				separate: true,
				offset: 0,
				limit: 10

			});

			$scope.queryinclude = _.map($scope.search.include, function(n) {
				return JSON.stringify(n);
			});





			$scope.mdMedia = $mdMedia;


			$scope.callServer = function(tableState) {
				if ($scope.count && $scope.count < tableState.pagination.start) {
					return false;
				}
				$scope.isLoading = true;

				var pagination = tableState.pagination;

				var offset = pagination.start || 0; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
				var limit = pagination.number || 500; // Number of entries showed per page.

				offset = parseInt(offset);
				limit = parseInt(limit)


				console.log("offset " + offset)
				console.log("count " + $scope.count)
				/*
				if (!tableState.sort.predicate) {
					tableState.sort.predicate = 'observationDate';
					tableState.sort.reverse = true;
				} */
				var order = tableState.sort.predicate;
				if (tableState.sort.reverse) {
					order += " DESC"
				};
				var geometry = ObservationSearchService.getSearch().geometry;
				var query = {
					order: order || 'observationDate DESC',
					offset: offset,
					limit: limit,
					activeThreadsOnly: ObservationSearchService.getSearch().activeThreadsOnly,
					where: ObservationSearchService.getSearch().where || {},
					include: JSON.stringify($scope.queryinclude)
				};

				if (geometry) {
					query.geometry = geometry;
				}
				/*
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
					*/




				Observation.query(query, function(result, headers) {

					//$scope.taxonCount = headers('count');

					var numPages = Math.ceil(parseInt(headers('count')) / limit);
					tableState.pagination.numberOfPages = numPages; //set the number of pages so the pagination can update
					tableState.pagination.totalItemCount = parseInt(headers('count'));

					$scope.paginationPages = (tableState.pagination.numberOfPages < 5) ? tableState.pagination.numberOfPages : 5;

					$scope.fromRecord = offset + 1;

					$scope.toRecord = (tableState.pagination.totalItemCount < (offset + limit)) ? tableState.pagination.totalItemCount : (offset + limit);

					$scope.displayed = result;
					$scope.isLoading = false;
				});

			};



		}
	]);
