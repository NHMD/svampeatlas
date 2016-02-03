'use strict';

angular.module('svampeatlasApp')
	.controller('SearchResultMapCtrl', ['$scope', 'ObservationSearchService', 'Taxon','TaxonDKnames', 'Locality', 'leafletData', '$timeout','$stateParams', 'Observation','appConstants',
		function($scope, ObservationSearchService, Taxon,TaxonDKnames, Locality, leafletData, $timeout, $stateParams, Observation, appConstants) {
			$scope.appConstants = appConstants;
			var geometry = ObservationSearchService.getSearch().geometry;
			ObservationSearchService.getSearch().include.push({
					model: "ObservationImage",
					as: 'Images',
					offset: 0,
					limit: 1
				});
				ObservationSearchService.getSearch().include = _.map(ObservationSearchService.getSearch().include, function(n) {
								return JSON.stringify(n)
							});
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
					lng: 11.5,
					zoom: 7
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
			 var leafletView = new PruneClusterForLeaflet();
			 
			$scope.getMarker = function(observation){
			/*
				$scope.mapsettings.markers[observation._id] = {
                lat: observation.decimalLatitude,
                lng: observation.decimalLongitude,
                
                draggable: false,
				
				observation: observation
            } */
				var message = "";
				if(observation.Images && observation.Images.length > 0){
					
					message +=  "<img src='"+$scope.appConstants.imageurl+observation.Images[0].name+".jpg' width='200px'  ><br>";
				}
				if(observation.DeterminationView.Taxon_vernacularname_dk){
					message += "<strong>"+observation.DeterminationView.Taxon_vernacularname_dk +"</strong> (<em>"+observation.DeterminationView.Taxon_FullName+"</em>)";
				} else {
					message += "<strong><em>"+observation.DeterminationView.Taxon_FullName+"</em></strong>" ;
				}
				message += "<br>";
				if(observation.Locality){
					message += observation.Locality.name +", ";
				}
				 message +=  moment(observation.observationDate).format('DD/MM/YYYY') + "<br>"+observation.PrimaryUser.name ;
				leafletView.RegisterMarker(new PruneCluster.Marker(observation.decimalLatitude, observation.decimalLongitude,  {title: message}));
			}
			
		   

		    leafletView.PrepareLeafletMarker = function (marker, data) {
		        if (marker.getPopup()) {
		            marker.setPopupContent(data.title);
		        } else {
		            marker.bindPopup(data.title);
		        }
		    };

			leafletData.getMap().then(function(map) {
				
			map.spin(true);
			
			 Observation.query(query).$promise.then(function(data){
				 
				$scope.data = data;
				
				
				for(var i=0; i< data.length; i++){
					$scope.getMarker(data[i])
				};
				
				//map.fitBounds($scope.mapsettings.markers.getBounds(), { padding: [20, 20] });
				map.spin(false);
				 map.addLayer(leafletView);
			})

			
			$scope.$on('leafletDirectiveMarker.click', function(e, args) {
			    var observation = args.model.observation;
				var message = "";
				if(observation.Images && observation.Images.length > 0){
					
					message +=  "<img ng-src='"+$scope.appConstants.imageurl+observation.Images[0].name+".jpg' width='200px'  ><br>";
				}
				if(observation.DeterminationView.Taxon_vernacularname_dk){
					message += "<strong>"+observation.DeterminationView.Taxon_vernacularname_dk +"</strong> (<em>"+observation.DeterminationView.Taxon_FullName+"</em>)";
				} else {
					message += "<strong><em>"+observation.DeterminationView.Taxon_FullName+"</em></strong>" ;
				}
				message += "<br>";
				if(observation.Locality){
					message += observation.Locality.name +", ";
				}
				 message +=  moment(observation.observationDate).format('DD/MM/YYYY') + "<br>"+observation.PrimaryUser.name ;
				 
				 $scope.mapsettings.markers[observation._id].message = message;
				 $scope.mapsettings.markers[observation._id].getMessageScope = function() {return $scope; };
				 $scope.mapsettings.markers[observation._id].compileMessage = true;
				 $scope.mapsettings.markers[observation._id].focus = true;
			    
			});

			})
			
			
		}
	]);
