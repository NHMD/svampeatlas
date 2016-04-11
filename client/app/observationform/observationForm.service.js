'use strict';
angular.module('svampeatlasApp')
	.factory('ObservationFormService', function($mdDialog, appConstants) {

			return {
				show: function(ev) {


					$mdDialog.show({
						controller: ['$scope', '$http', 'Auth', 'ErrorHandlingService', '$mdDialog', 'Taxon', 'TaxonDKnames', 'TaxonAttributes', 'Locality','User', 'Observation', 'Determination', '$mdMedia', '$mdToast', 'leafletData', 'KMS', 'ArcGis', '$timeout', 'GeoJsonUtils','VegetationType','Substrate','PlantTaxon','Upload',
							function($scope, $http, Auth, ErrorHandlingService, $mdDialog, Taxon, TaxonDKnames, TaxonAttributes, Locality, User, Observation, Determination, $mdMedia, $mdToast, leafletData, KMS, ArcGis, $timeout, GeoJsonUtils, VegetationType, Substrate, PlantTaxon, Upload) {
								$scope.substrates = Substrate.query();
								$scope.vegetationtypes = VegetationType.query();
								$scope.$mdMedia = $mdMedia;
								$scope.newTaxon = [];
								$scope.selectedLocality = [];
								$scope.associatedOrganism = [];
								$scope.associatedOrganismImport = [];
								$scope.determiner = [];
								$scope.users = [];
								$scope.currentUser = User.get();
								$scope.users.push($scope.currentUser);
								$scope.determiner.push($scope.currentUser);
								$scope.$watchCollection('newTaxon', function(newVal) {
									if (newVal && newVal[0] && newVal[0]._id) {
										TaxonAttributes.get({
											id: newVal[0]._id
										}).$promise.then(function(attrs) {
											$scope.taxonAttrs = attrs;


										});
									} else {
										delete $scope.taxonAttrs;
									}
								})

								$scope.$watchCollection('selectedLocality', function(newVal) {
									if (newVal && newVal[0] && newVal[0]._id) {

										if (newVal[0]._id > 0) {
											$scope.changeBaseLayer("topo_25")
										} else {
											$scope.changeBaseLayer("WorldTopoMap")
										}

										$scope.mapsettings.center = {
											lat: newVal[0].decimalLatitude,
											lng: newVal[0].decimalLongitude,
											zoom: 14
										}



									}
								})

								$scope.determination = {
									confidence: 'sikker'
								};


								$scope.querySearchLocality = function(query) {

									var q = {
										where: {
											name: {
												like: "%" + query + "%"
											},
											include: 1
										},
										limit: 30

									};

									if ($scope.mapsettings.markers.position) {

										var bounds = L.circle(L.latLng($scope.mapsettings.markers.position.lng, $scope.mapsettings.markers.position.lat), 5000).getBounds();
										
										
										q.where.decimalLongitude ={
											$between: [bounds.getSouth(), bounds.getNorth()]
										}
										q.where.decimalLatitude = {
											$between: [bounds.getWest(), bounds.getEast()]
										}
										
									}

									var results = query ? Locality.query(q).$promise : [];

									return results;
								}

								$scope.querySearch = function(query) {

									var RankID = ($scope.onlyHigherTaxa) ? {
										lt: 10000
									} : {
										gt: 5000
									};

									var q = {
										where: {
											RankID: RankID
										},
										limit: 30,
										include: [{
											model: "Taxon",
											as: 'acceptedTaxon'
										}, {
											model: "TaxonDKnames",
											as: "Vernacularname_DK"
										}]
									};


									if ($scope.DkNames) {
										q.include[1].where = JSON.stringify({
											vernacularname_dk: {
												like: "%" + query + "%"
											}
										})
									} else {

										q.where = {
											FullName: {
												like: "%" + query + "%"
											}
										};


									}


									var results = query ? Taxon.query({
										where: JSON.stringify(q.where),
										include: JSON.stringify(q.include),
										limit: 30

									}).$promise : [];

									return results;

								};

								$scope.querySearchPlantTaxon = function(query) {


									var results = query ? PlantTaxon.query({
										where: {
											$or: [{DKname: {
												like: query + "%"
											}}, {LatinName: {
												like: query + "%"
											}}]
											
										},
										limit: 30
									}).$promise : [];

									return results;

								};
								
								$scope.querySearchGBIFPlantTaxon = function(query) {


									var results = query ? $http({
												method: 'GET',
												url: 'http://api.gbif.org/v1/species/suggest',
												params: {
													datasetKey : '046bbc50-cae2-47ff-aa43-729fbf53f7c5',
													q: query
													
												}
											}).then(function(res){
												return res.data;
											}) : [];

									return results;

								};
								
								$scope.querySearchUser = function(query) {

									var results = query ? User.query({
										where: {
											$or: [{name: {
												like: query + "%"
											}}, {Initialer: {
												like: query + "%"
											}}]
											
										},
										limit: 30
									}).$promise : [];

									return results;

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


								function getMarkerPrecision(zoom){
									
									if(zoom <= 6){
										return 50000;
									} else if(zoom >= 19) {
										return 2;
									};
									switch(zoom){
										case 7: return 25000;
										break;
										case 8: return 10000;
										break;
										case 9: return 5000;
										break;
										case 10: return 2500;
										break;
										case 11: return 1000;
										break;
										case 12: return 250;
										break;
										case 13: return 100;
										break;
										case 14: return 75;
										break;
										case 15: return 50;
										break;
										case 16: return 25;
										break;
										case 17: return 10;
										break;
										case 18: return 5;
										break;
										default: return 10000;	
									}
									
									
								};
								$scope.changeBaseLayer = function(key) {
									leafletData.getMap('observationformmap').then(function(map) {
										leafletData.getLayers().then(function(layers) {
											_.each(layers.baselayers, function(layer) {
												map.removeLayer(layer);
											});
											map.addLayer(layers.baselayers[key]);
										});
									});
								};

								leafletData.getMap('observationformmap').then(function(map) {

									$timeout(function() {
										map.invalidateSize();
									});

									map.on('click', function(e) {
										
										
										$scope.precision = getMarkerPrecision(map.getZoom());
										
										$scope.mapsettings.markers.position = {
											lat: e.latlng.lat,
											lng: e.latlng.lng,

										}
										$scope.mapsettings.center.lat = e.latlng.lat;
										$scope.mapsettings.center.lng = e.latlng.lng;


										if ($scope.mapsettings.center.zoom < 10) {
											$scope.mapsettings.center.zoom = 10
										} else if ($scope.mapsettings.center.zoom >= 10 && $scope.mapsettings.center.zoom < 18) {
											$scope.mapsettings.center.zoom++;
										}
										//console.log("########## "+GeoJsonUtils.inDK($scope.mapsettings.center))

										if (!GeoJsonUtils.inDK($scope.mapsettings.markers.position)) {
											$http({
												method: 'GET',
												url: '/api/geonames/findnearby',
												params: {
													lat: $scope.mapsettings.markers.position.lat,
													lng: $scope.mapsettings.markers.position.lng
												}
											}).then(function(res) {
												var direction = GeoJsonUtils.direction($scope.mapsettings.markers.position, res.data.geonames[0]);

												$scope.foreignLocalityString = res.data.geonames[0].countryName + ", " + res.data.geonames[0].adminName1 + ", " + (Math.round(res.data.geonames[0].distance * 1000)) + " m " + direction + " " + res.data.geonames[0].name + " (" + res.data.geonames[0].fcodeName + ")";
												$scope.foreignLocality = res.data.geonames[0];
												
												$scope.selectedLocality = [];
											});
										} else {
											delete $scope.foreignLocalityString;
											delete $scope.foreignLocality;
										}
									});


									//map.invalidateSize(false)

								})

								$scope.cancel = function() {
									$mdDialog.cancel();
								};
								
								// IMAGES
								$scope.files = [];

							
								
							// upload later on form submit or something similar
							    $scope.submit = function() {
							      if ($scope.form.file.$valid && $scope.file) {
							        $scope.upload($scope.file);
							      }
							    };

							    // upload on file select or drop
							    $scope.upload = function (file) {
							        Upload.upload({
							            url: 'upload/url',
							            data: {file: file, 'username': $scope.username}
							        }).then(function (resp) {
							            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
							        }, function (resp) {
							            console.log('Error status: ' + resp.status);
							        }, function (evt) {
							            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
							        });
							    };
							    // for multiple files:
								
							    $scope.uploadFiles = function (files) {
							      if (files && files.length) {
							        
							        // or send them all together for HTML5 browsers:
							        Upload.upload({url: 'api/observations/'+479551+'/images', arrayKey: '', data: {file: files, 'obsprefix': 'TSJ2012'}})
									.then(function (resp) {
							            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
							        }, function (resp) {
							            console.log('Error status: ' + resp.status);
							        }, function (evt) {
							            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
							        });
							      }
							    }
								
								$scope.removeImageFromUpload = function(img){
									
									_.remove($scope.files, function(file) {
									  return file === img;
									});
									
								}
								// END IMAGES
							}
						],
						templateUrl: 'app/observationform/observation-form-modal.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true,
						fullscreen: true
					})



				}
			};




		}

)
