'use strict';

angular.module('svampeatlasApp')
	.controller('SearchSpeciesListCtrl', ['$scope', 'Auth', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'Observation', '$mdMedia', '$mdDialog', 'ObservationSearchService', '$stateParams', '$state', 'ObservationModalService', 'ObservationFormService', 'appConstants', 'StoredSearch',
		function($scope, Auth, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService, $stateParams, $state, ObservationModalService, ObservationFormService, appConstants, StoredSearch) {

			$scope.Auth = Auth;
			$scope.stItemsPrPage = 100;
			$scope.mdMedia = $mdMedia;
			$scope.baseUrl = appConstants.baseurl;
			$scope.ObservationFormService = ObservationFormService;



			$scope.csvSeparator = ",";
			$scope.setCsvSeparator = function(sep) {
				$scope.csvSeparator = sep;
			}


			$scope.getTaxonListCsv = function() {



				var mapped = _.map($scope.displayed, function(e) {
					return {



						taxon_id: e.DeterminationView.Taxon_id,
						taxonFullName: e.DeterminationView.Taxon_FullName,
						taxonDanishName: e.DeterminationView.Taxon_vernacularname_dk,
						observationCount: e.observationCount,
						taxonRedListCategory: e.DeterminationView.Taxon_redlist_status,
						URI: appConstants.baseurl + "/taxon/" + e.DeterminationView.Taxon_id




					}
				})

				return mapped;

			}







			$scope.showSpeciesSearch = function(row, view) {
				var search = ObservationSearchService.getSearch();
				search.include[0].where = {
					Taxon_id: row.DeterminationView.Taxon_id
				};
				if (view === 'list') {
					$state.go('search-list')
				} else if (view === 'map') {
					$state.go('search-map')
				}
			}

			if ($stateParams.where) {
				ObservationSearchService.reset();
				var search = ObservationSearchService.getSearch();
				search.where = $stateParams.where;
				if ($stateParams.geometry) {
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
						attributes: ['Initialer', 'name'],
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

				if ($stateParams.determinationViewWhere) {
					search.include[0].where = $stateParams.determinationViewWhere;
				}
			}
			
			if(ObservationSearchService.storedSearch && ObservationSearchService.storedSearch._id){
				$state.transitionTo('search-specieslist', {searchid: ObservationSearchService.storedSearch._id}, {
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
					ObservationSearchService.uiSearchToDBquery(storedSearch, search)
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
			
			
			
			
			
			
			

			// if we came directly from the map view, remove images and forum from include
			/*
			$scope.search.include = $scope.search.include.slice(0, 5);
		
			
			$scope.search.include[0].attributes = ['Taxon_id',  'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID',  'Taxon_redlist_status', 'Determination_user_id'],
			$scope.search.include[1].attributes = [ 'Initialer', 'name'];
			
*/
			
storedSearchDeferred.promise.then(function(){
	var search = ObservationSearchService.getSearch();
	if (search.include[0].where.Taxon_id) {
		delete search.include[0].where.Taxon_id;
	}
	$scope.search = angular.copy(ObservationSearchService.getSearch());
	$scope.queryinclude = _.map($scope.search.include, function(n) {
		return JSON.stringify(n);
	});



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
})




		}
	]);
