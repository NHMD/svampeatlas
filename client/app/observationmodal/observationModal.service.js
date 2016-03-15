'use strict';
angular.module('svampeatlasApp')
	.factory('ObservationModalService', function($mdDialog, appConstants) {

			return {
				show: function(ev, observation_id) {


					$mdDialog.show({
						controller: ['$scope', 'Auth','ErrorHandlingService','$mdDialog', 'Observation', '$mdMedia', 'leafletData', 'KMS', 'ArcGis', '$timeout',
							function($scope, Auth,ErrorHandlingService, $mdDialog, Observation, $mdMedia, leafletData, KMS, ArcGis, $timeout) {
								$scope.User = Auth.getCurrentUser();
								$scope.isLoggedIn = Auth.isLoggedIn;
								$scope.postComment = function(newComment){
									$scope.sendingComment = true;
									Observation.postComment({id: $scope.obs._id}, {content: newComment})
									.$promise.then(function(comment){
										$scope.forum.push(comment);
										delete $scope.newComment;
										$scope.sendingComment = false;
									})
									.catch(function(err){
										$scope.sendingComment = false;
										ErrorHandlingService.handle500();
									})
									
								};
								$scope.mapsettings = {
									center: {
										lat: 56,
										lng: 11,
										zoom: 6
									},
									paths: {},
									drawControl: true,
									markers: {
										
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
								$scope.changeBaseLayer = function(key) {
									leafletData.getMap('observationdetailmap').then(function(map) {
										leafletData.getLayers().then(function(layers) {
											_.each(layers.baselayers, function(layer) {
												map.removeLayer(layer);
											});
											map.addLayer(layers.baselayers[key]);
										});
									});
								};

								

								$scope.$mdMedia = $mdMedia;
								$scope.getDate = function(observationDate, observationDateAccuracy) {
									if (observationDate === undefined) {
										return "";
									}
									var splitted = observationDate.split(" ")[0].split("-");

									if (observationDateAccuracy === 'month') {
										//console.log("spl "+parseInt(splitted[1]))
										return moment.months()[parseInt(splitted[1]) - 1] + " " + splitted[0];
									} else if (observationDateAccuracy === 'year') {
										return splitted[0];
									} else if (observationDateAccuracy === 'invalid') {
										return "ingen dato"
									}

								}
								$scope.forum = Observation.getForum({
									id: observation_id
								});
								$scope.obs = Observation.get({
									id: observation_id
								});

								$scope.obs.$promise.then(function(obs) {
									$scope.mapsettings.paths.circle = {
										type: "circle",
										radius: obs.accuracy,
										weight: 2,
										opacity: 0.25,
										latlngs: {
											lat: obs.decimalLatitude,
											lng: obs.decimalLongitude
										}
									}
									var zoom = parseInt(obs.accuracy) > 10000 ?  8 : parseInt(obs.accuracy) <= 10000 && parseInt(obs.accuracy) >= 5000 ? 10 : parseInt(obs.accuracy) < 5000 && parseInt(obs.accuracy) >= 2000 ? 12 : parseInt(obs.accuracy) < 2000 && parseInt(obs.accuracy) >= 500 ? 13 : parseInt(obs.accuracy) < 500 && parseInt(obs.accuracy) >= 250 ? 14 : parseInt(obs.accuracy) < 250 && parseInt(obs.accuracy) >= 100 ? 15 : 16;
									
										$scope.mapsettings.center =  {
										lat: obs.decimalLatitude,
										lng: obs.decimalLongitude,
											zoom: zoom
									}
									
									$scope.mapsettings.markers.location = {
											lat: obs.decimalLatitude,
											lng: obs.decimalLongitude,
											draggable: false
										}
										leafletData.getMap('observationdetailmap').then(function(map) {
											if (obs.Locality._id > 0) {
												$scope.changeBaseLayer("topo_25")
											} else {
												$scope.changeBaseLayer("WorldTopoMap")
											}
											$timeout(function() {
												map.invalidateSize();
											});
											//map.invalidateSize(false)

										})
									
								})

								$scope.imageurl = appConstants.imageurl;
								$scope.loaded = {};
								$scope.failed = {};
								$scope.imageHasLoaded = function(img) {
									$scope.loaded[img] = true;

								};
								$scope.imageHasFailed = function(img) {
									$scope.failed[img] = true;

								};
								$scope.cancel = function() {
									$mdDialog.cancel();
								};


							}
						],
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
		return ( !! input) ? input.replace(reg, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}) : '';
	}
});
