'use strict';

angular.module('svampeatlasApp')
	.controller('SearchResultMapCtrl', ['$scope', 'ObservationSearchService', 'Taxon','TaxonDKnames', 'Locality', 'leafletData', '$timeout','$stateParams', 'Observation','appConstants','KMS',
		function($scope, ObservationSearchService, Taxon,TaxonDKnames, Locality, leafletData, $timeout, $stateParams, Observation, appConstants, KMS) {
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
						},
					
						topo_25: {
							name: "4cm kort",
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
							name: "luftfoto",
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
						}
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
