'use strict';
angular.module('svampeatlasApp')
.factory('ObservationModalService', function($mdDialog, appConstants) {
						
						return {
							show: function(ev, row) {


								$mdDialog.show({
									controller: ['$scope', '$mdDialog', 'Observation', '$mdMedia', 'leafletData','KMS', 'ArcGis', '$timeout',function($scope, $mdDialog, Observation, $mdMedia, leafletData,KMS, ArcGis, $timeout) {
										
										$scope.mapsettings = {
											center: {
												lat: row.decimalLatitude,
												lng: row.decimalLongitude,
												zoom: 15
											},
											drawControl: true,
											markers: {
												location: {
												lat: row.decimalLatitude,
												lng: row.decimalLongitude,
													draggable: false	
												}
											},
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
										$scope.changeBaseLayer = function (key) {
										        leafletData.getMap().then(function (map) {
										            leafletData.getLayers().then(function (layers) {
										                _.each(layers.baselayers, function (layer) {
										                    map.removeLayer(layer);
										                });
										                map.addLayer(layers.baselayers[key]);
										            });
										        });
										    };
										
						leafletData.getMap().then(function(map) {
							if(row.Locality._id > 0){
								$scope.changeBaseLayer("topo_25")
							} else {
								$scope.changeBaseLayer("WorldTopoMap")
							}
						    $timeout(function(){
						         map.invalidateSize();
						       });
							//map.invalidateSize(false)
							
						})
										
										$scope.$mdMedia = $mdMedia;
						$scope.getDate = function(observationDate, observationDateAccuracy){
							if(observationDate === undefined){
								return "";
							}
							var splitted = observationDate.split(" ")[0].split("-");
				
							if(observationDateAccuracy === 'month'){
								//console.log("spl "+parseInt(splitted[1]))
								return moment.months()[parseInt(splitted[1])-1] +" "+splitted[0];
							} else if(observationDateAccuracy === 'year'){
								return splitted[0];
							} else if(observationDateAccuracy === 'invalid'){
								return "ingen dato"
							}
				
						}
						$scope.forum = Observation.getForum({id: row._id});
		    			$scope.obs = Observation.get({id: row._id});
						
						$scope.imageurl = appConstants.imageurl;
						$scope.loaded = {};
						$scope.failed = {};
						$scope.imageHasLoaded = function(img){
							$scope.loaded[img] = true;
							
						};
						$scope.imageHasFailed = function(img){
							$scope.failed[img] = true;
							
						};
						$scope.cancel = function() {
						    $mdDialog.cancel();
						  };
		    			
		    			
		    		}],
									templateUrl: 'app/observationmodal/observation-modal.tpl.html',
									parent: angular.element(document.body),
									targetEvent: ev,
									clickOutsideToClose: true,
									fullscreen: true
								})



							}
						};
						
						
					

					}
				
				)
			  .
			    filter('capitalize', function() {
			      return function(input, all) {
			        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
			        return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
			      }
			    });