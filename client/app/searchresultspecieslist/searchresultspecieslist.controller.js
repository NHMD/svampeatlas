'use strict';

angular.module('svampeatlasApp')
	.controller('SearchSpeciesListCtrl', ['$scope', 'Auth', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'Observation', '$mdMedia', '$mdDialog', 'ObservationSearchService', '$stateParams', '$state', 'ObservationModalService', 'ObservationFormService', 'appConstants',
		function($scope, Auth, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService, $stateParams, $state, ObservationModalService, ObservationFormService, appConstants) {
			
			$scope.Auth = Auth;
			$scope.stItemsPrPage = 100;
			
$scope.ObservationFormService = ObservationFormService;






$scope.getTaxonListCsv = function(){


		
		var mapped =  _.map($scope.displayed, function(e){
			return {
				
				
		
				taxon_id: e.DeterminationView.Taxon_id,
				taxonFullName: e.DeterminationView.Taxon_FullName,
				taxonDanishName: e.DeterminationView.Taxon_vernacularname_dk,
				observationCount: e.observationCount,
				taxonRedListCategory: e.DeterminationView.Taxon_redlist_status,
				URI: appConstants.baseurl +"/taxon/"+e.DeterminationView.Taxon_id
				
			
			

			}
		})
		
		return mapped;
	
}







$scope.showSpeciesSearch = function(row, view){
	var search = ObservationSearchService.getSearch();
	search.include[0].where = {Taxon_id: row.DeterminationView.Taxon_id };
	if(view === 'list'){
		$state.go('search-list')
	} else if(view === 'map'){
		$state.go('search-map')
	}
}
			
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
var search = ObservationSearchService.getSearch();
if(search.include[0].where.Taxon_id){
	delete search.include[0].where.Taxon_id;
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


		}
	]);
