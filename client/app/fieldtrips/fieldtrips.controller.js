'use strict';

angular.module('svampeatlasApp')
	.controller('FieldTripsCtrl', ['$scope', 'Auth', 'User', '$mdMedia', 'ObservationSearchService', '$state', 'ObservationFormStateService', 'ObservationFormService',
		function($scope, Auth, User, $mdMedia, ObservationSearchService, $state, ObservationFormStateService, ObservationFormService) {
			
			
			$scope.stItemsPrPage = 100;


$scope.showFieldTripSearch = function(row, view){
	ObservationSearchService.reset();
	var search = ObservationSearchService.getSearch();
	search.wasInitiatedOutsideSearchForm = true;
	search.where = {observationDate : row.observationDate, primaryuser_id: Auth.getCurrentUser()._id};
	
	if(row.inDK === 1){
		search.include[2].where = {_id : row.locality_id};
	} else {
		search.include[2].required = false;
		search.where.locality_id = {$eq: null};
		search.include[3].required = true;
		search.include[3].where = {adminName1 : row.localityname};
	}
	
	if(view === 'list'){
		$state.go('search-list')
	} else if(view === 'map'){
		$state.go('search-map')
	} else if(view === 'gallery'){
		$state.go('search-gallery')
	}
	
	
	
}

$scope.addObservationToFieldTrip = function(ev, row){
	
	ObservationFormStateService.reset();
	ObservationFormStateService.getState().observationDate = new Date(row.observationDate);
	if(row.inDK ===1){
		ObservationFormStateService.getState().Locality =  { _id: row.locality_id, name: row.localityname, decimalLatitude: row.decimalLatitude, decimalLongitude:  row.decimalLongitude}
	}
	
	ObservationFormStateService.getState().mapCenter = {lat: row.decimalLatitude, lng: row.decimalLongitude , zoom: 14}
	ObservationFormService.show(ev)
}






			$scope.mdMedia = $mdMedia;
			

			$scope.isLoading = true;
			
			 User.getFieldTrips({id: Auth.getCurrentUser()._id})
			.$promise.then(function(data){
				$scope.serverData =  data;
				$scope.totalItemCount = data.length;
				$scope.isLoading = false;
			})
			

			
			
			
			




		}
	]);
