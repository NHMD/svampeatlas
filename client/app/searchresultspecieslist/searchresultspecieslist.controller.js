'use strict';

angular.module('svampeatlasApp')
	.controller('SearchSpeciesListCtrl', ['$scope', 'Auth', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'Observation', '$mdMedia', '$mdDialog', 'ObservationSearchService', '$stateParams', '$state', 'ObservationModalService', 'ObservationFormService',
		function($scope, Auth, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService, $stateParams, $state, ObservationModalService, ObservationFormService) {
			
			$scope.Auth = Auth;
			$scope.stItemsPrPage = 100;
			
$scope.ObservationFormService = ObservationFormService;
			
if ($stateParams.where) {
	ObservationSearchService.reset();
	var search = ObservationSearchService.getSearch();
	search.where = $stateParams.where;
	if($stateParams.geometry){
		search.geometry = $stateParams.geometry;
	}
	search.include = [{
			model: "DeterminationView",
			as: "DeterminationView",
			attributes: ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName', 'Determination_user_id'],
			where: {}
		}, {
			model: "User",
			as: 'PrimaryUser',
			attributes: [ 'Initialer', 'name'],
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
		}

	];
	
	if($stateParams.determinationViewWhere){
		search.include[0].where = $stateParams.determinationViewWhere;
	}
}

			$scope.search = angular.copy(ObservationSearchService.getSearch());

			if (_.isEmpty($scope.search)) {
				$state.go('search')
			};
			// if we came directly from the map view, remove images and forum from include
			/*
			$scope.search.include = $scope.search.include.slice(0, 5);
		
			
			$scope.search.include[0].attributes = ['Taxon_id',  'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID',  'Taxon_redlist_status', 'Determination_user_id'],
			$scope.search.include[1].attributes = [ 'Initialer', 'name'];
			
*/
			$scope.queryinclude = _.map(_.filter($scope.search.include, function(e){ return e.model !== 'GeoNames'}), function(n) {
				return JSON.stringify(n);
			});





			$scope.mdMedia = $mdMedia;
			
			var geometry = ObservationSearchService.getSearch().geometry;
			var query = {
		
				activeThreadsOnly: $scope.search.activeThreadsOnly,
				selectedMonths: $scope.search.selectedMonths,
				where: $scope.search.where || {},
				include: JSON.stringify($scope.queryinclude)
			};
		
			if (geometry) {
				query.geometry = geometry;
			}
			$scope.isLoading = true;
			Observation.getSpeciesList(query, function(result, headers) {

				//$scope.taxonCount = headers('count');
				$scope.totalItemCount = parseInt(headers('count'));
				$scope.serverData = result;
				$scope.isLoading = false;
			});
			
			
			
			
			
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
				
				
				
				
				
				
				
				var geometry = ObservationSearchService.getSearch().geometry;
				var query = {
					// order: order || 'DeterminationView.Taxon_FullName ASC',
				//	_order:  [['DeterminationView.Taxon_FullName', 'ASC']],
					offset: offset,
					//limit: limit,
					activeThreadsOnly: $scope.search.activeThreadsOnly,
					selectedMonths: $scope.search.selectedMonths,
					where: $scope.search.where || {},
					include: JSON.stringify($scope.queryinclude)
				};
				if(order) {
					query._order = [[order]]
					
					if(tableState.sort.reverse){
						query._order[0].push('DESC')
					} else {
						query._order[0].push('ASC')
					}
					query._order = JSON.stringify(query._order)
				}
				if (geometry) {
					query.geometry = geometry;
				}





				Observation.getSpeciesList(query, function(result, headers) {

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
