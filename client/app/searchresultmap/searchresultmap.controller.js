'use strict';

angular.module('svampeatlasApp')
	.controller('SearchResultMapCtrl', ['$scope','Auth', '$compile', 'ObservationSearchService', 'Taxon', 'TaxonDKnames', 'Locality', 'leafletData', '$timeout', '$stateParams', 'Observation', 'appConstants', 'KMS', 'MapBox', '$state', 'ErrorHandlingService','ObservationModalService', 'ObservationFormService','$mdMedia','$translate','StoredSearch','$q',
		function($scope, Auth, $compile, ObservationSearchService, Taxon, TaxonDKnames, Locality, leafletData, $timeout, $stateParams, Observation, appConstants, KMS, MapBox, $state, ErrorHandlingService, ObservationModalService, ObservationFormService, $mdMedia, $translate, StoredSearch, $q) {
			
			$scope.Auth = Auth;
			$scope.baseUrl = appConstants.baseurl;
			$scope.mdMedia = $mdMedia;
			var zoom = ($mdMedia('sm')) ? 5 :7;
			
			$scope.mapsettings = {
				center: {
					lat: 56,
					lng: 11.5,
					zoom: zoom
				},
				//drawControl: true,
				controls: {
				                    scale: true
				                },
				markers: {},
				layers: {
					baselayers: {
						osm: {
							name: $translate.instant('Kort'),
							url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
							type: 'xyz'
						},
						OpenTopoMap: {
							name: 'OpenTopoMap',

							url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',

							type: 'xyz',
							layerOptions: {

								attribution: 'Tiles &copy; opentopomap.org'
							}

						}
						



					}
				}
			};
			
			MapBox.getTicket().then(function(ticket){
				
				$scope.mapsettings.layers.baselayers.mapbox_outdoors = {
							name: 'Mapbox Outdoors',
							url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=' + ticket,
							type: 'xyz'

						},
						$scope.mapsettings.layers.baselayers.mapbox_satelite = {
							name: 'Mapbox Satelite',
							url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=' + ticket,
							type: 'xyz'

						};
			});
			
			KMS.getTicket().then(function(ticket){
				
				$scope.mapsettings.layers.baselayers.topo_25 = {
							name: "DK 4cm kort",
							type: 'wms',
							visible: true,
							url: "https://kortforsyningen.kms.dk/topo_skaermkort",
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
							url: "https://kortforsyningen.kms.dk/topo_skaermkort",
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
			
			if(ObservationSearchService.storedSearch && ObservationSearchService.storedSearch._id && !$stateParams.searchterm){
				$state.transitionTo('search-map', {searchid: ObservationSearchService.storedSearch._id}, {
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
					$scope.search = ObservationSearchService.getSearch();
					var storedSearch  = JSON.parse(ss.search);
					if (!$scope.search.where) {
						$scope.search.where = {};
					}

					ObservationSearchService.convertSearchDateStrings(storedSearch)
					ObservationSearchService.uiSearchToDBquery(storedSearch, $scope.search)
					$scope.queryinclude = JSON.stringify(_.map($scope.search.include, function(n) {

						return JSON.stringify(n);
					}));
					
					storedSearchDeferred.resolve();
					$scope.storedSearch = ss;
					ObservationSearchService.storedSearch = ss;
					
				})
				
				
			} else {
				$scope.search = ObservationSearchService.getSearch();
				if (_.isEmpty($scope.search)) {
					$state.go('search')
				};
				$scope.queryinclude = JSON.stringify(_.map($scope.search.include, function(n) {

					return JSON.stringify(n);
				}));
				storedSearchDeferred.resolve();
				
			}
			
			
			
			
			
	
			$scope.ObservationModalService = ObservationModalService;
			
		
			



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
				+"<span ng-if='observation.DeterminationView.Taxon_vernacularname_dk'><strong> {{observation.DeterminationView.Taxon_vernacularname_dk | capitalize}} </strong> (<em> {{observation.DeterminationView.Taxon_FullName}} </em>)</span>"
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
				if (observation.DeterminationView.Determination_validation === "Godkendt" || observation.DeterminationView.Determination_score >= appConstants.AcceptedDeterminationScore) {
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
				popupScope.imageurl = appConstants.baseurl+appConstants.thumborUrl+"300x0/"+appConstants.baseurl+appConstants.imageurl;
				
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
				
				var query = {

					where: $scope.search.where || {},
					activeThreadsOnly: ObservationSearchService.getSearch().activeThreadsOnly,
					
					include: $scope.queryinclude
				};
				
				if (ObservationSearchService.getSearch().selectedMonths)   {
					query.selectedMonths = ObservationSearchService.getSearch().selectedMonths.toString();
				};
				
				query.offset = $scope.offset ;
				query.limit = 1000 ;
				
				var geometry = ObservationSearchService.getSearch().geometry;


			
				

				if (geometry) {
					query.geometry = geometry;
				}
				
				
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
						storedSearchDeferred.promise.then(function(){
							$scope.fetchPage(map);
						})
					} else {
						$scope.doneFetchingData = true;
					//	map.spin(false);
						//map.addLayer($scope.leafletView);
					}
				})
				


			})

		
		}
	]);
