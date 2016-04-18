'use strict';
angular.module('svampeatlasApp')
	.factory('ObservationFormService', function($mdDialog, appConstants) {

			return {
				show: function(ev) {


					$mdDialog.show({
						controller: ['$scope', '$q','$http', 'Auth', 'ErrorHandlingService', '$mdDialog', 'Taxon', 'TaxonDKnames', 'TaxonAttributes', 'Locality', 'User', 'Observation', 'Determination', '$mdMedia', '$mdToast', 'leafletData', 'KMS', 'ArcGis', '$timeout', 'GeoJsonUtils', 'VegetationType', 'Substrate', 'PlantTaxon', 'Upload',
							function($scope, $q, $http, Auth, ErrorHandlingService, $mdDialog, Taxon, TaxonDKnames, TaxonAttributes, Locality, User, Observation, Determination, $mdMedia, $mdToast, leafletData, KMS, ArcGis, $timeout, GeoJsonUtils, VegetationType, Substrate, PlantTaxon, Upload) {
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
								$scope.observationDate = new Date();
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
								
								
								$scope.observationIsValid = function(){
									var valid = true;
									
									if($scope.newTaxon.length === 0 || !$scope.newTaxon[0]._id) valid = false;
									if($scope.determiner.length === 0 || !$scope.determiner[0]._id) valid = false;
									if(!$scope.selectedSubstrate) valid = false;
									if(!$scope.selectedVegetationType) valid = false;
									if($scope.users.length === 0 || !$scope.users[0]._id) valid = false;
									if(($scope.selectedLocality.length === 0 || !$scope.selectedLocality[0]._id) && (!$scope.foreignLocality)) valid = false;
									
									return valid;
									
								}
								
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
											}
										},
										limit: 30

									};

									if ($scope.mapsettings.markers.position) {

										var bounds = L.circle(L.latLng($scope.mapsettings.markers.position.lng, $scope.mapsettings.markers.position.lat), 5000).getBounds();


										q.where.decimalLongitude = {
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
											$or: [{
												DKname: {
													like: query + "%"
												}
											}, {
												LatinName: {
													like: query + "%"
												}
											}]

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
											datasetKey: '046bbc50-cae2-47ff-aa43-729fbf53f7c5',
											q: query,
											rank: "SPECIES"
										}
									}).then(function(res) {
										return res.data;
									}) : [];

									return results;

								};

								$scope.querySearchUser = function(query) {

									var results = query ? User.query({
										where: {
											$or: [{
												name: {
													like: query + "%"
												}
											}, {
												Initialer: {
													like: query + "%"
												}
											}]

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
										overlays: {
											position: {
												type: 'group',
												name: 'position',
												visible: true
											},
											localities: {
												type: 'group',
												name: 'localities',
												visible: true
											}

											
										},
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


								function getMarkerPrecision(zoom) {

									if (zoom <= 6) {
										return 50000;
									} else if (zoom >= 19) {
										return 2;
									};
									switch (zoom) {
										case 7:
											return 25000;
											break;
										case 8:
											return 10000;
											break;
										case 9:
											return 5000;
											break;
										case 10:
											return 2500;
											break;
										case 11:
											return 1000;
											break;
										case 12:
											return 250;
											break;
										case 13:
											return 100;
											break;
										case 14:
											return 75;
											break;
										case 15:
											return 50;
											break;
										case 16:
											return 25;
											break;
										case 17:
											return 10;
											break;
										case 18:
											return 5;
											break;
										default:
											return 10000;
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
									$scope.localityOnMapButton =	L.easyButton('fa-globe fa-lg', function(btn, map) {
											if(!$scope.showLocalitiesOnMap){
												$scope.showLocalitiesOnMap = true;
												if($scope.mapsettings.markers.position){
													$scope.setNearbyLocalities();
												}
												
											} else {
												$scope.showLocalitiesOnMap = false;
												$scope.removeLocalitiesFromMap();
											}

										}).addTo(map);
										if($scope.mapsettings.center.zoom < 11){
											$scope.localityOnMapButton.disable();
										}
										
									});

								
								$scope.removeLocalitiesFromMap = function(){
									
									_.each($scope.mapsettings.markers, function(m){
										if(m.layer === 'localities'){
											delete $scope.mapsettings.markers[m.name]
										}
									})
									
									
								};
								
								$scope.setNearbyLocalities = function(){
									
									$scope.removeLocalitiesFromMap();
									
									var bounds = L.circle(L.latLng($scope.mapsettings.markers.position.lng, $scope.mapsettings.markers.position.lat), 2000).getBounds();

									var q = {
										where: {}
									};
									q.where.decimalLongitude = {
										$between: [bounds.getSouth(), bounds.getNorth()]
									}
									q.where.decimalLatitude = {
										$between: [bounds.getWest(), bounds.getEast()]
									}
									Locality.query(q).$promise.then(function(localities) {

										for (var i = 0; i < localities.length; i++) {
											$scope.mapsettings.markers[localities[i].name] = {
												lat: localities[i].decimalLatitude,
												lng: localities[i].decimalLongitude,
												_id: localities[i]._id,
												
												name: localities[i].name,
												layer: 'localities',
												icon: {
													type: 'awesomeMarker',
													prefix: 'fa',
													icon: 'crosshairs',
													markerColor: 'red'
												}

											};
										}
										
										
									})
								}
								
								
								$scope.$on('leafletDirectiveMarker.observationformmap.click', function(event, args){
									if(args.model.layer === 'localities'){
										$scope.selectedLocality = [args.model];
										
										$scope.resetLocalityMarkerIcons();
										
										$scope.mapsettings.markers[args.model.name].icon = {
											type: 'awesomeMarker',
											prefix: 'fa',
											icon: 'check-square',
											markerColor: 'green'
										}
										
										
											$scope.localityOnMapButton.enable();
										
									}
								                   
								                });
								
								$scope.resetLocalityMarkerIcons = function(){
									_.each($scope.mapsettings.markers, function(m){
										if(m.layer === 'localities'){
											$scope.mapsettings.markers[m.name].icon = {
										type: 'awesomeMarker',
										prefix: 'fa',
										icon: 'crosshairs',
										markerColor: 'red'
									}

										}
									})
								}
								
								$scope.$watch('mapsettings.center.zoom', function(newVal, oldVal){
									
									if(newVal && newVal !== oldVal){
										if(newVal > 11 && GeoJsonUtils.inDK($scope.mapsettings.center)){
											$scope.localityOnMapButton.enable();
										} else {
											$scope.localityOnMapButton.disable();
										}
									}
									
								});
								
								leafletData.getMap('observationformmap').then(function(map) {

									$timeout(function() {
										map.invalidateSize();
									});

									map.on('click', function(e) {
										

										$scope.precision = getMarkerPrecision(map.getZoom());

										$scope.mapsettings.markers.position = {
											lat: e.latlng.lat,
											lng: e.latlng.lng,
											layer: 'position'

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
											if($scope.showLocalitiesOnMap){
												$scope.setNearbyLocalities();
											}
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


								$scope.selectedTabIndex =0;
								
								$scope.$watch('files', function(newVal, oldVal){
									if(newVal && newVal.length > 0){
										$scope.selectedTabIndex =2;
									}
								})
					

								$scope.removeImageFromUpload = function(img) {

									_.remove($scope.files, function(file) {
										return file === img;
									});

								}
								// END IMAGES
								$scope.processassociatedOrganismImport = function() {
									var promises = [];
									 _.each($scope.associatedOrganismImport, function(e) {
										 promises.push(PlantTaxon.save({

											DKandLatinName: e.species,
											LatinName: e.species,
											gbiftaxon_id: e.nubKey
										}).$promise.then(function(planttaxon){
											$scope.associatedOrganism.push(planttaxon);
											_.remove($scope.associatedOrganismImport, function(e){
												return e.nubKey === planttaxon.gbiftaxon_id;
											})
										}))
									
									})
									
									return $q.all(promises)
								}
								
								

								$scope.submitObservation = function() {
									var determination = {
										taxon_id: $scope.newTaxon[0]._id,
										user_id: $scope.determiner[0]._id
									};
									
									
									
									var obs = {
										observationDate: $scope.observationDate,
										primaryuser_id: $scope.users[0]._id,
										
										substrate_id: $scope.selectedSubstrate,
										vegetationtype_id: $scope.selectedVegetationType,
										ecologynote: $scope.ecologynote,
										
										accuracy: $scope.precision,
										fieldnumber: $scope.fieldnumber,
										herbarium: $scope.herbarium,
										note: $scope.note,
										determination: determination,
										associatedOrganisms: $scope.associatedOrganism,
										associatedOrganismImport: $scope.associatedOrganismImport,
										users: $scope.users
										
									};
									
									if($scope.selectedLocality.length === 1 && $scope.selectedLocality[0]._id){
										obs.locality_id = $scope.selectedLocality[0]._id;
										
									}
									
									if(!$scope.mapsettings.markers.position && $scope.selectedLocality.length === 1){
										obs.decimalLatitude =$scope.selectedLocality[0].decimalLatitude;
										obs.decimalLongitude = $scope.selectedLocality[0].decimalLongitude;
										obs.accuracy = 2500;
									} else {
										obs.decimalLatitude= $scope.mapsettings.markers.position.lat;
										obs.decimalLongitude = $scope.mapsettings.markers.position.lng;
									}
									
									if($scope.foreignLocality){
										obs.geoname = $scope.foreignLocality;
										obs.verbatimLocality = $scope.foreignLocalityString;
										
										obs.geonameId = $scope.foreignLocality.geonameId;
									}
									
									
									var importPromise = ($scope.associatedOrganismImport.length > 0) ? $scope.processassociatedOrganismImport() : $q.resolve();
									
									importPromise.then(function(){
										if ($scope.associatedOrganism.length > 0) {
											obs.primaryassociatedorganism_id = $scope.associatedOrganism[0]._id;
										}
										return Observation.save(obs).$promise;
									})
									
										.then(function(obs) {

											if ($scope.files && $scope.files.length) {

												// or send them all together for HTML5 browsers:
												return Upload.upload({
													url: 'api/observations/' + obs._id + '/images',
													arrayKey: '',
													data: {
														file: $scope.files
													}
												})
													.then(function(resp) {
														console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
													}, function(resp) {
														console.log('Error status: ' + resp.status);
													}, function(evt) {
														var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
														console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
													});
											} else {
												return true
											}

										})
										.then(function() {
											$scope.cancel();
										})
										.
									catch (function(err) {
										alert("error")
									})
									
								};
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

