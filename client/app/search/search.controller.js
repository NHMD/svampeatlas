'use strict';

angular.module('svampeatlasApp')
	.controller('SearchCtrl', ['$scope', 'ObservationSearchService','Taxon', 'Locality',
		function($scope, ObservationSearchService, Taxon, Locality) {
			
			$scope.querySearchLocality = function(query) {
				
						
				var results = query ? Locality.query({
					where: {
						name: {
							like: "%" + query + "%"
						}},
					limit: 30

				}).$promise : [];

				return results;
			}
			
			$scope.querySearch = function(query) {
				var RankID = ($scope.onlyHigherTaxa) ? { lt: 10000 } : { gt: 5000 };
				var where = ($scope.DkNames===true) ? {
						vernacularname_dk: {
							like: "%" + query + "%"
						},
						RankID : RankID
						
					}: {
						FullName: {
							like: "%" + query + "%"
						},
						RankID : RankID
						
					};
						
				var results = query ? Taxon.query({
					where: where,
					include:JSON.stringify([JSON.stringify({
						model: "Taxon",
						as: 'acceptedTaxon'
					})]),
					limit: 30

				}).$promise : [];

				return results;
			}
			
			$scope.taxonPlaceholder = "Latinsk navn"
			$scope.$watch('DkNames', function(newVal, oldVal){
				if(newVal === true){
					$scope.taxonPlaceholder = "Dansk navn"
				} else {
					$scope.taxonPlaceholder = "Latinsk navn"
				}
			})
			
			$scope.observationSearch = ObservationSearchService.getSearch();
			$scope.observationSearch.where = {};
			
			$scope.search = {};
			
			$scope.search.include = [{
							model:"DeterminationView",
							as: "DeterminationView",
							attributes: ['Taxon_id', 'Recorded_as_id','Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName'],
							where:{}
						}, {
							model: "User",
							as: 'PrimaryUser',
							attributes: ['email', 'Initialer', 'name'],
							where:{}
						}, {
							model: "Locality",
							as: 'Locality',
							where:{}
						}, {
							model: "ObservationImage",
							as: 'Images',
							separate : true,
							offset:0,
							limit: 10
						}, {
							model: "ObservationForum",
							as: 'Forum',
							separate : true,
							offset:0,
							limit: 10
				
						}

					];

					
		 $scope.search.selectedHigherTaxa =[];
		 $scope.search.selectedLocalities =[];
			
			//observationSearch.where.observationDate.$between[0]
		  $scope.$watch('search', function(newVal, oldVal){
			  
			  if($scope.search.selectedHigherTaxa.length > 0){
				  $scope.search.include[0].where.$or = _.map($scope.search.selectedHigherTaxa, function(tx) {
				return {
					Taxon_path: {
						like: tx.acceptedTaxon.Path + "%"
					}
				}
			})
			  }
			
			  if($scope.search.selectedLocalities.length > 0){
				  $scope.search.include[2].where.$or = _.map($scope.search.selectedLocalities, function(loc) {
				return {
					name: {
						like: loc.name + "%"
					}
				}
			})
			  }
			
		  	
			  if($scope.search.include[0].where.Taxon_redlist_status  === "ALL" ){
			  	$scope.search.include[0].where.Taxon_redlist_status = ['RE','CR', 'EN', 'VU', 'NT']
			  }
			 $scope.observationSearch.include = _.map($scope.search.include, function(n){ return JSON.stringify(n)});
			 if($scope.search.databasenumber){
				$scope.observationSearch.where._id = $scope.search.databasenumber.split("-")[1];
			 }
			  if($scope.search.fromDate && $scope.search.toDate){
			  	$scope.observationSearch.where.observationDate = {$between: [$scope.search.fromDate, $scope.search.toDate]}
			  }
			  
		  }, true)
		}
	]);
