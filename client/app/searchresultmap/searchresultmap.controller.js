'use strict';

angular.module('svampeatlasApp')
	.controller('SearchResultMapCtrl', ['$scope', '$compile', 'ObservationSearchService', 'Taxon', 'TaxonDKnames', 'Locality', 'leafletData', '$timeout', '$stateParams', 'Observation', 'appConstants', 'KMS', 'ArcGis', '$state', 'ErrorHandlingService','ObservationModalService', '$mdMedia',
		function($scope, $compile, ObservationSearchService, Taxon, TaxonDKnames, Locality, leafletData, $timeout, $stateParams, Observation, appConstants, KMS, ArcGis, $state, ErrorHandlingService, ObservationModalService, $mdMedia) {
			console.log("md media "+$mdMedia('sm'))
			var zoom = ($mdMedia('sm')) ? 5 :7;
			
			$scope.mapsettings = {
				center: {
					lat: 56,
					lng: 11.5,
					zoom: zoom
				},
				drawControl: true,
				markers: {},
				layers: {
					baselayers: {
						osm: {
							name: 'Kort',
							url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
							type: 'xyz'
						},
						topo_25: {
							name: "DK 4cm kort",
							type: 'wms',
							visible: true,
							url: "http://kortforsyningen.kms.dk/topo_skaermkort",
							layerOptions: {
								layers: "topo25_klassisk",
								servicename: "topo25",
								version: "1.1.1",
								request: "GetMap",
								format: "image/jpeg",
								service: "WMS",
								styles: "default",
								exceptions: "application/vnd.ogc.se_inimage",
								jpegquality: "80",
								attribution: "Indeholder data fra GeoDatastyrelsen, WMS-tjeneste",
								ticket: KMS.getTicket()
							}
						},
						luftfoto: {
							name: "DK luftfoto",
							type: 'wms',
							visible: true,
							url: "http://kortforsyningen.kms.dk/topo_skaermkort",
							layerOptions: {
								layers: "orto_foraar",
								servicename: "orto_foraar",
								version: "1.1.1",
								request: "GetMap",
								format: "image/jpeg",
								service: "WMS",
								styles: "default",
								exceptions: "application/vnd.ogc.se_inimage",
								jpegquality: "80",
								attribution: "Indeholder data fra GeoDatastyrelsen, WMS-tjeneste",
								ticket : KMS.getTicket()
							}
						},
						WorldImagery: {
							name: 'WorldImagery',
							url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png',
							type: 'xyz',
							visible: true,
							layerOptions: {
								token: ArcGis.getTicket(),
								attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
							}
						},
						WorldTopoMap: {
							name: 'WorldTopoMap',
							url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png',
							type: 'xyz',
							visible: true,
							layerOptions: {
								token: ArcGis.getTicket(),
								attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
							}
						},



					}
				}
			};
			
			
			$scope.appConstants = appConstants;
			$scope.search = ObservationSearchService.getSearch();
			$scope.ObservationModalService = ObservationModalService;
			if (_.isEmpty($scope.search)) {
				$state.go('search')
			}
			var geometry = $scope.search.geometry;

			// if we came directly from the list table view, remove images and forum from include
			$scope.search.include = $scope.search.include.slice(0,3);

			$scope.search.include.push({
				model: "ObservationImage",
				as: 'Images',
				offset: 0,
				limit: 1

			});
			$scope.queryinclude = _.map($scope.search.include, function(n) {

				if (n.model === "DeterminationView") {
					n.attributes = ['Taxon_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Determination_validation'];
				}
				if (n.model === "Locality") {
					n.attributes = ['name'];
				}
				if (n.model === "User") {
					n.attributes = ['name'];
				}
				return JSON.stringify(n);
			});
			var query = {

				where: $scope.search.where || {},
				activeThreadsOnly: ObservationSearchService.getSearch().activeThreadsOnly,
				include: JSON.stringify($scope.queryinclude)
			};

			if (geometry) {
				query.geometry = geometry;
			}





			$scope.leafletView = new PruneClusterForLeaflet(50);
			
				
			

			$scope.getMarker = function(observation) {

				$scope.leafletView.RegisterMarker(new PruneCluster.Marker(observation.decimalLatitude, observation.decimalLongitude, {
					observation: observation
				}));
			}

			

			$scope.leafletView.PrepareLeafletMarker = function(marker, data) {
				
				var observation = data.observation;
				var message = "<div layout='column'>"
				+ "<div width='301px' ng-if='observation.Images && observation.Images.length > 0'><img ng-src='{{imageurl + observation.Images[0].name + \".jpg\"}}' width='300px'  ></div>"
				+"<span ng-if='observation.DeterminationView.Taxon_vernacularname_dk'><strong> {{observation.DeterminationView.Taxon_vernacularname_dk}} </strong> (<em> {{observation.DeterminationView.Taxon_FullName}} </em>)</span>"
				+"<strong ng-if='!observation.DeterminationView.Taxon_vernacularname_dk'><em>{{observation.DeterminationView.Taxon_FullName}} </em></strong>"
				+"<span ng-if='observation.Locality && observation.Locality.name'>{{observation.Locality.name}} , {{moment(observation.observationDate).format('DD/MM/YYYY')}} </span>"
				+"<span ng-if='!(observation.Locality && observation.Locality.name)'>{{moment(observation.observationDate).format('DD/MM/YYYY')}} </span>"
				+"<span>{{observation.PrimaryUser.name}}</span>"
				+'<md-button class="md-raised"  ng-click="ObservationModalService.show($event, observation)"> <span layout-fill>Vis mere</span> <ng-md-icon icon="arrow_forward" ></ng-md-icon></md-button>'
			    +"</div>";
				var iconOptions = {
					prefix: 'fa',
					icon: 'circle'
				};
				if (observation.Images && observation.Images.length > 0) {
					iconOptions.icon = 'camera';
				};
				if (observation.DeterminationView.Determination_validation === "Godkendt") {
					iconOptions.markerColor = 'blue';
					marker.category = 0;
				} else if (observation.DeterminationView.Determination_validation === "Afvist") {
					iconOptions.markerColor = 'red';
					iconOptions.icon = 'ban';
					marker.category = 2;
				} else {
					iconOptions.markerColor = 'orange';
					marker.category = 1;
				}

				marker.setIcon(L.AwesomeMarkers.icon(iconOptions));
				var popupScope = $scope.$new(true);
				popupScope.observation = observation;
				popupScope.ObservationModalService = ObservationModalService;
				popupScope.moment = moment;
				popupScope.imageurl = $scope.appConstants.imageurl;
				var compiled = $compile(message)(popupScope);
				
				if (marker.getPopup()) {
					marker.setPopupContent(compiled[0]);
				} else {
					marker.bindPopup(compiled[0]);
				}
			};
			
			
			//$scope.data = [];
			
			$scope.fetchPage = function(map){
				
				map.spin(true);
				query.offset = $scope.offset ;
				query.limit = 10000 ;
				return Observation.query(query, function(data, headers) {
					$scope.count = parseInt(headers('count'));
					$scope.limit = parseInt(headers('limit'));
					$scope.offset = parseInt(headers('offset')) + 10000;
					//$scope.data.concat(data);

					
						for (var i = 0; i < data.length; i++) {
							$scope.getMarker(data[i])
							$scope.leafletView.ProcessView();
						};

						//map.fitBounds($scope.mapsettings.markers.getBounds(), { padding: [20, 20] });
						map.spin(false);
					//	map.addLayer($scope.leafletView);
					
						
				
					
									
				
				}, function(err, headers) {
					map.spin(false);
					ErrorHandlingService.handle500();
					//map.fitBounds($scope.mapsettings.markers.getBounds(), { padding: [20, 20] });
					
					//map.addLayer($scope.leafletView);
				}).$promise;
				
			};
			
			$scope.$on('leafletDirectiveMap.layeradd', function(e, args) {
				
				console.log(args)
			})
			
			$scope.$on('leafletDirectiveMap.layerremove', function(e, args) {
				console.log(args)
			})
			
			leafletData.getMap("searchresultmap").then(function(map) {
				$timeout(function() {
					map.invalidateSize();
				});
				$scope.offset = 0;
				
				map.addLayer($scope.leafletView);	
						
					
				
				$scope.$watch('offset', function(newVal, oldVal){
						var max = ($scope.count !== undefined) ? Math.min(50000, $scope.count) : 50000;
					if(newVal !== undefined && newVal < max){
						$scope.fetchPage(map);
					} else {
					//	map.spin(false);
						//map.addLayer($scope.leafletView);
					}
				})
				


			})

		
		}
	]);
