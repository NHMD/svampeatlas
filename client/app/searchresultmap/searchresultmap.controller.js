'use strict';

angular.module('svampeatlasApp')
	.controller('SearchResultMapCtrl', ['$scope', 'ObservationSearchService', 'Taxon', 'TaxonDKnames', 'Locality', 'leafletData', '$timeout', '$stateParams', 'Observation', 'appConstants', 'KMS', 'ArcGis', '$state', 'ErrorHandlingService',
		function($scope, ObservationSearchService, Taxon, TaxonDKnames, Locality, leafletData, $timeout, $stateParams, Observation, appConstants, KMS, ArcGis, $state, ErrorHandlingService) {
			$scope.appConstants = appConstants;
			$scope.search = ObservationSearchService.getSearch();
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
				limit: 1,
				separate: true

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
				include: JSON.stringify($scope.queryinclude)
			};

			if (geometry) {
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
								ticket: KMS.getTicket()
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
			/*		
	var		options = {
			    topo_25: {
			        layers: "topo25_klassisk",
			        servicename: "topo25",
			        nickname: "topo_25"
			    },

			    topo_historisk_1842_1899: {
			        layers: "dtk_hoeje_maalebordsblade",
			        servicename: "topo20_hoeje_maalebordsblade",
			        nickname: "topo_historisk_1842_1899"
			    },
			    topo_historisk_1928_1940: {
			        layers: "dtk_lave_maalebordsblade",
			        servicename: "topo20_lave_maalebordsblade",
			        nickname: "topo_historisk_1928_1940"
			    },
			    luftfoto: {
			        layers: "orto_foraar",
			        servicename: "orto_foraar",
			        nickname: "luftfoto"
			    }
			};
			
			
	var	    baseLayers = {
		               topo_25: L.tileLayer.wms("http://kortforsyningen.kms.dk/topo_skaermkort", $.extend({}, r, options.topo_25)),
		             
		               topo_historisk_1842_1899: L.tileLayer.wms("http://kortforsyningen.kms.dk/topo_skaermkort", $.extend({}, r, options.topo_historisk_1842_1899)),
		               topo_historisk_1928_1940: L.tileLayer.wms("http://kortforsyningen.kms.dk/topo_skaermkort", $.extend({}, r, options.topo_historisk_1928_1940)),

		               luftfoto: L.tileLayer.wms("http://kortforsyningen.kms.dk/topo_skaermkort", $.extend({}, r, options.luftfoto))
		           }
			
			*/

			var leafletView = new PruneClusterForLeaflet(50);


			$scope.getMarker = function(observation) {
				/*
				$scope.mapsettings.markers[observation._id] = {
                lat: observation.decimalLatitude,
                lng: observation.decimalLongitude,
                
                draggable: false,
				
				observation: observation
            } */


				leafletView.RegisterMarker(new PruneCluster.Marker(observation.decimalLatitude, observation.decimalLongitude, {
					observation: observation
				}));
			}



			leafletView.PrepareLeafletMarker = function(marker, data) {
				var observation = data.observation;
				var message = "";
				if (observation.Images && observation.Images.length > 0) {

					message += "<img src='" + $scope.appConstants.imageurl + observation.Images[0].name + ".jpg' width='200px'  ><br>";
				}
				if (observation.DeterminationView.Taxon_vernacularname_dk) {
					message += "<strong>" + observation.DeterminationView.Taxon_vernacularname_dk + "</strong> (<em>" + observation.DeterminationView.Taxon_FullName + "</em>)";
				} else {
					message += "<strong><em>" + observation.DeterminationView.Taxon_FullName + "</em></strong>";
				}
				message += "<br>";
				if (observation.Locality) {
					message += observation.Locality.name + ", ";
				}
				message += moment(observation.observationDate).format('DD/MM/YYYY') + "<br>" + observation.PrimaryUser.name;
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

				if (marker.getPopup()) {
					marker.setPopupContent(message);
				} else {
					marker.bindPopup(message);
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
					};

					//map.fitBounds($scope.mapsettings.markers.getBounds(), { padding: [20, 20] });
					map.spin(false);
				//	map.addLayer(leafletView);
				
					leafletView.ProcessView();
									
				
				}, function(err, headers) {
					map.spin(false);
					ErrorHandlingService.handle500();
					//map.fitBounds($scope.mapsettings.markers.getBounds(), { padding: [20, 20] });
					
					//map.addLayer(leafletView);
				}).$promise;
				
			};
			

			
			leafletData.getMap().then(function(map) {
				$scope.offset = 0;
				
				map.addLayer(leafletView);
				$scope.$watch('offset', function(newVal, oldVal){
						var max = ($scope.count !== undefined) ? Math.min(100000, $scope.count) : 100000;
					if(newVal !== undefined && newVal < max){
						$scope.fetchPage(map);
					} else {
					//	map.spin(false);
						//map.addLayer(leafletView);
					}
				})
				


				$scope.$on('leafletDirectiveMarker.click', function(e, args) {
					var observation = args.model.observation;
					var message = "";
					if (observation.Images && observation.Images.length > 0) {

						message += "<img ng-src='" + $scope.appConstants.imageurl + observation.Images[0].name + ".jpg' width='200px'  ><br>";
					}
					if (observation.DeterminationView.Taxon_vernacularname_dk) {
						message += "<strong>" + observation.DeterminationView.Taxon_vernacularname_dk + "</strong> (<em>" + observation.DeterminationView.Taxon_FullName + "</em>)";
					} else {
						message += "<strong><em>" + observation.DeterminationView.Taxon_FullName + "</em></strong>";
					}
					message += "<br>";
					if (observation.Locality) {
						message += observation.Locality.name + ", ";
					}
					message += moment(observation.observationDate).format('DD/MM/YYYY') + "<br>" + observation.PrimaryUser.name;

					$scope.mapsettings.markers[observation._id].message = message;
					$scope.mapsettings.markers[observation._id].getMessageScope = function() {
						return $scope;
					};
					$scope.mapsettings.markers[observation._id].compileMessage = true;
					$scope.mapsettings.markers[observation._id].focus = true;

				});

			})


		}
	]);
