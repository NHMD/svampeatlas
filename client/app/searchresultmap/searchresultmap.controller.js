'use strict';

angular.module('svampeatlasApp')
	.controller('SearchResultMapCtrl', ['$scope', 'ObservationSearchService', 'Taxon','TaxonDKnames', 'Locality', 'leafletData', '$timeout','$stateParams', 'Observation',
		function($scope, ObservationSearchService, Taxon,TaxonDKnames, Locality, leafletData, $timeout, $stateParams, Observation) {
			
			var geometry = ObservationSearchService.getSearch().geometry;
			var query = {
						
						 where: ObservationSearchService.getSearch().where || {},
						 include: JSON.stringify(ObservationSearchService.getSearch().include)
					};

			if(geometry){
				query.geometry = geometry;
			}
			
			
			$scope.mapsettings = {
				center: {
					lat: 56,
					lng: 11,
					zoom: 6
				},
				drawControl: true,
				markers: {},
				layers: {
					baselayers: {
						osm: {
							name: 'OpenStreetMap',
							url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
							type: 'xyz'
						}
					}
				}
			};

			$scope.getMarker = function(observation){
				$scope.mapsettings.markers[observation._id] = {
                lat: observation.decimalLatitude,
                lng: observation.decimalLongitude,
                message: observation.DeterminationView.Taxon_FullName,
                focus: true,
                draggable: false
            }
			}
			

			leafletData.getMap().then(function(map) {
				
			
			
			 Observation.query(query).$promise.then(function(data){
				$scope.data = data;
				for(var i=0; i< data.length; i++){
					$scope.getMarker(data[i])
				}
			})

			})
			
			
		}
	]);
