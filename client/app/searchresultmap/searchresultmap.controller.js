'use strict';

angular.module('svampeatlasApp')
	.controller('SearchResultMapCtrl', ['$scope','Auth', '$compile', 'ObservationSearchService', 'Taxon', 'TaxonDKnames', 'Locality', 'leafletData', '$timeout', '$stateParams', 'Observation', 'appConstants', 'KMS', 'ArcGis', '$state', 'ErrorHandlingService','ObservationModalService', 'ObservationFormService','$mdMedia','$translate',
		function($scope, Auth, $compile, ObservationSearchService, Taxon, TaxonDKnames, Locality, leafletData, $timeout, $stateParams, Observation, appConstants, KMS, ArcGis, $state, ErrorHandlingService, ObservationModalService, ObservationFormService, $mdMedia, $translate) {
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
			
			KMS.getTicket().then(function(ticket){
				$scope.mapsettings.layers.baselayers.topo_25 = {
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
								ticket: ticket
							}
						};
						$scope.mapsettings.layers.baselayers.luftfoto = {
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
								ticket: ticket
							}
						};
			});
			
			
			$scope.appConstants = appConstants;
			
			
			
			if ( $stateParams.taxon_id) {
				ObservationSearchService.reset();
				var search = ObservationSearchService.getSearch();
				search.where = {};
				search.wasInitiatedOutsideSearchForm = true;
				
				if($stateParams.taxon_id ){
								search.include[0].where.Taxon_id = $stateParams.taxon_id;
					
							};
			}
			
			$scope.search = ObservationSearchService.getSearch();
			
			$scope.ObservationModalService = ObservationModalService;
			if (_.isEmpty($scope.search)) {
				$state.go('search')
			}
			var geometry = $scope.search.geometry;

			// if we came directly from the list table view, remove images and forum from include
			/*
			$scope.search.include = $scope.search.include.slice(0,5);

			$scope.search.include.push({
				model: "ObservationImage",
				as: 'Images',
				offset: 0,
				limit: 1

			});
			*/
			$scope.queryinclude = _.map($scope.search.include, function(n) {
				/*
				if (n.model === "DeterminationView") {
					n.attributes = ['Taxon_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Determination_validation', 'Determination_user_id'];
				}
				if (n.model === "Locality") {
					n.attributes = ['name'];
				}
				if (n.model === "User") {
					n.attributes = ['name', 'Initialer'];
				}
				*/
				return JSON.stringify(n);
			});
			var query = {

				where: $scope.search.where || {},
				activeThreadsOnly: ObservationSearchService.getSearch().activeThreadsOnly,
				selectedMonths: ObservationSearchService.getSearch().selectedMonths,
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
				+ "<div width='301px' ng-if='observation.Images && observation.Images.length > 0'><img ng-src='{{imageurl + observation.Images[0].name + \".JPG\"}}' width='300px'  ></div>"
				+"<span ng-if='observation.DeterminationView.Taxon_vernacularname_dk'><strong> {{observation.DeterminationView.Taxon_vernacularname_dk}} </strong> (<em> {{observation.DeterminationView.Taxon_FullName}} </em>)</span>"
				+"<strong ng-if='!observation.DeterminationView.Taxon_vernacularname_dk'><em>{{observation.DeterminationView.Taxon_FullName}} </em></strong>"
				+"<span ng-if='observation.Locality && observation.Locality.name'>{{observation.Locality.name}} , {{moment(observation.observationDate).format('DD/MM/YYYY')}} </span>"
				+"<span ng-if='!(observation.Locality && observation.Locality.name)'>{{moment(observation.observationDate).format('DD/MM/YYYY')}} </span>"
				+"<span>{{observation.PrimaryUser.name}}</span>"
				+'<md-button class="md-raised"  ng-click="ObservationModalService.show($event, observation)"> <span layout-fill>{{"Vis mere" | translate}}</span> <ng-md-icon icon="arrow_forward" ></ng-md-icon></md-button>'
				+'<md-button class="md-raised" ng-if="observation.primaryuser_id === currentUser._id" ng-click="ObservationFormService.show($event, observation)"> <span layout-fill>{{"Ret fund" | translate}}</span> <ng-md-icon icon="edit" ></ng-md-icon></md-button>'
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
				popupScope.ObservationFormService = ObservationFormService;
				popupScope.currentUser = Auth.getCurrentUser();
				popupScope.moment = moment;
				popupScope.$translate = $translate ;
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
				query.limit = 1000 ;
				return Observation.query(query, function(data, headers) {
					$scope.count = parseInt(headers('count'));
					$scope.limit = parseInt(headers('limit'));
					$scope.offset = parseInt(headers('offset')) + 1000;
					//$scope.data.concat(data);

					
						for (var i = 0; i < data.length; i++) {
							$scope.getMarker(data[i])
							$scope.leafletView.ProcessView();
						};

						//map.fitBounds($scope.mapsettings.markers.getBounds(), { padding: [20, 20] });
						map.spin(false);
					//	map.addLayer($scope.leafletView);
					var b = $scope.leafletView.Cluster.ComputeBounds($scope.leafletView.Cluster._markers);
					
					if(b){
						var bounds = new L.LatLngBounds(
						            new L.LatLng(b.minLat, b.maxLng),
						            new L.LatLng(b.maxLat, b.minLng));
					
							map.fitBounds(bounds);
					}
					
						
						
									
				
				}, function(err, headers) {
					map.spin(false);
					ErrorHandlingService.handle500();
					//map.fitBounds($scope.mapsettings.markers.getBounds(), { padding: [20, 20] });
					
					//map.addLayer($scope.leafletView);
				}).$promise;
				
			};
			

			
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
						$scope.doneFetchingData = true;
					//	map.spin(false);
						//map.addLayer($scope.leafletView);
					}
				})
				


			})

		
		}
	]);
