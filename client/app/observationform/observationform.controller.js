'use strict';

angular.module('svampeatlasApp')
  .controller('ObservationFormCtrl',['$scope','$rootScope','$filter', '$q', '$http', 'Auth', 'ErrorHandlingService', 'SearchService', '$mdDialog', '$mdSidenav', 'ssSideNav','Taxon',  'TaxonAttributes', 'Locality', 'Observation', 'ObservationImage', 'Determination', '$mdMedia', '$mdToast', 'leafletData', 'KMS', 'ArcGis', '$timeout', 'GeoJsonUtils', 'PlantTaxon', 'Upload', 'ObservationFormStateService', 'DeterminationModalService', '$translate','UserAgentService', 'appConstants','ObservationStateService',
							function($scope,$rootScope, $filter, $q, $http, Auth, ErrorHandlingService, SearchService, $mdDialog,$mdSidenav,ssSideNav, Taxon, TaxonAttributes, Locality,  Observation, ObservationImage, Determination, $mdMedia, $mdToast, leafletData, KMS, ArcGis, $timeout, GeoJsonUtils,  PlantTaxon, Upload, ObservationFormStateService, DeterminationModalService, $translate, UserAgentService, appConstants, ObservationStateService) {
								var row = ObservationStateService.get();
							 $scope.mdSidenav = $mdSidenav;
							 $scope.menu = ssSideNav;
							$scope.openSideNav = function(){

									$scope.menu.userHasForceClosed = false;

								 $mdSidenav('left').open();
							}
								
								$scope.$translate = $translate;
								$scope.imageurl = appConstants.imageurl;
								$scope.maxDate = new Date();
								$scope.$mdMedia = $mdMedia;
								$scope.newTaxon = [];
								$scope.selectedLocality = [];
								$scope.associatedOrganism = (ObservationFormStateService.getState().ecology) ? ObservationFormStateService.getState().ecology.associatedOrganism : [];
								$scope.associatedOrganismImport = [];
								$scope.determiner = [];
								$scope.users = [];
								$scope.currentUser = Auth.getCurrentUser();
								$scope.Auth = Auth;
								$scope.moment = moment;
								
								$scope.extendedAssociatedOrganismSearch = ObservationFormStateService.getState().extendedAssociatedOrganismSearch || false;
								$scope.toggelExtendedAssociatedOrganismSearch = function() {
									$scope.extendedAssociatedOrganismSearch = !$scope.extendedAssociatedOrganismSearch;
								}
								$scope.extendedHostRank = 'SPECIES'

								$scope.resetForm = function() {
									$scope.selectedLocality = [];
									$scope.observationDate = new Date();
									ObservationFormStateService.reset();
									$scope.mapsettings.center = {
										lat: 56,
										lng: 11,
										zoom: 6
									}
								}

								$scope.ecologyLocked = (ObservationFormStateService.getState().ecology) ? true : false;

								$scope.toggleEcologyLock = function(state) {
									$scope.ecologyLocked = state;
								}



								$scope.$watchCollection('selectedLocality', function(newVal) {
									if (newVal && newVal[0] && newVal[0]._id && newVal[0] !== ObservationFormStateService.getState().Locality) {
										/*
										if (newVal[0]._id > 0) {
											$scope.changeBaseLayer("topo_25")
										} else {
											$scope.changeBaseLayer("WorldTopoMap")
										}
										*/
										$scope.mapsettings.center = {
											lat: newVal[0].decimalLatitude || newVal[0].lat,
											lng: newVal[0].decimalLongitude || newVal[0].lng,
											zoom: 14
										}





									}
								})

								$scope.showSimpleToast = function(text, delay, pos) {
									var _delay = (delay) ? delay : 3000;
									var position = (pos) ? pos : "top right";
									$mdToast.show(
										$mdToast.simple()
										.textContent(text)
										.position(position)
										.parent(document.querySelectorAll('.speeddial-parent'))
										.hideDelay(_delay)
									);
								};

								$scope.updateValidation = function(validation) {

									Determination.updateValidation({
											id: $scope.obs.PrimaryDetermination._id
										}, {
											validation: validation
										}).$promise
										.then(function(determination) {
											$scope.obs.PrimaryDetermination.validation = determination.validation;
											var txt = (determination.validation === "Afventer") ? "Bestemmelse afventer" : ("Fundet er " + determination.validation);
											$scope.showSimpleToast(txt)
										})
										.catch(function(err) {

											ErrorHandlingService.handle500();
										})
								}

								$scope.showDeterminationDialog = function($event, obs) {
									DeterminationModalService.show($event, obs, 'ObservationFormService');
								}
								$scope.showDeterminationEditDialog = function($event, obs) {
									DeterminationModalService.show($event, obs, 'ObservationFormService', true);
								}


								// wrap initial load of obs in timeout to increase speed
								$timeout(function() {

									$scope.obsPromise = (row) ? Observation.get({
										id: row._id
									}).$promise : $q.resolve(false);
									$scope.obsPromise.then(function(obs) {
											// edit mode
											if (obs) {
												$scope.obs = obs;

												if (obs.Locality) {
													$scope.selectedLocality.push(obs.Locality);
												};
												$scope.newTaxon.push(obs.PrimaryDetermination.Taxon);
												$scope.users = obs.users;
												if(obs.users.length === 0 && obs.verbatimLeg !== undefined){
													$scope.users = [obs.verbatimLeg]
												}
												$scope.determiner.push(obs.PrimaryDetermination.User)
												$scope.associatedOrganism = obs.associatedTaxa;
												$scope.observationDate = new Date(obs.observationDate);
												$scope.ecologynote = obs.ecologynote;

												$scope.precision = obs.accuracy;

												$scope.fieldnumber = obs.fieldnumber;
												$scope.herbarium = obs.herbarium;
												$scope.note = obs.note;
												if (Auth.hasRole('validator')) {
													$scope.noteInternal = obs.noteInternal;
												}

												$scope.mapsettings.markers.position = {
													lat: obs.decimalLatitude,
													lng: obs.decimalLongitude,
													layer: 'position'

												}

												$scope.mapsettings.center = {
													lat: obs.decimalLatitude,
													lng: obs.decimalLongitude,
													zoom: 14
												}

												if (obs.GeoNames) {
													$scope.foreignLocalityString = obs.verbatimLocality;
													$scope.foreignLocality = obs.GeoNames
												}

											} else {
												$scope.users.push($scope.currentUser);
												$scope.determiner.push($scope.currentUser);
												$scope.observationDate = ObservationFormStateService.getState().observationDate || new Date();

												if (ObservationFormStateService.getState().Locality) {
													$scope.selectedLocality.push(ObservationFormStateService.getState().Locality);
												} else if (ObservationFormStateService.getState().foreignLocality) {
													$scope.mapsettings.center = {
														lat: parseFloat(ObservationFormStateService.getState().foreignLocality.lat),
														lng: parseFloat(ObservationFormStateService.getState().foreignLocality.lng),
														zoom: 14
													}

												}
											}
											if(ObservationStateService.duplicateRecord) {
												
												$scope.duplicateID = obs._id;
												delete obs._id;
												obs.Forum = [];
												obs.Images = [];
												$scope.showSimpleToast($translate.instant('Du har nu klonet') + ' DMS-'+$scope.duplicateID +'. '+$translate.instant('Husk at gemme det klonede fund før du lukker dette vindue.'), 5000, 'top left')
											}
											
											return obs;

										})
										.then(function(obs) {
											SearchService.getSubstrate().then(function(substrates) {
												$scope.substrates = substrates;

												if (obs) {
													$scope.selectedSubstrate = obs.substrate_id;
												} else if (ObservationFormStateService.getState().ecology) {

													$scope.selectedSubstrate = ObservationFormStateService.getState().ecology.selectedSubstrate;
												}

											});
											SearchService.getVegetationType().then(function(vegetationtypes) {
												$scope.vegetationtypes = vegetationtypes;

												if (obs) {
													$scope.selectedVegetationType = obs.vegetationtype_id;
												} else if (ObservationFormStateService.getState().ecology) {

													$scope.selectedVegetationType = ObservationFormStateService.getState().ecology.selectedVegetationType;
												}

											});
										})

									leafletData.getMap('observationformmap').then(function(map) {

										$timeout(function() {
											map.invalidateSize();
										});

										map.on('click', function(e) {


											$scope.precision = $scope.getMarkerPrecision(map.getZoom());

											$scope.mapsettings.markers.position = {
												lat: e.latlng.lat,
												lng: e.latlng.lng,
												layer: 'position'

											}


											$scope.mapsettings.center.lat = e.latlng.lat;
											$scope.mapsettings.center.lng = e.latlng.lng;




											if ($scope.mapsettings.center.zoom < 10) {
												$scope.mapsettings.center.zoom = 10
											} else if ($scope.mapsettings.center.zoom >= 10 && $scope.mapsettings.center.zoom < 14) {
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
												if ($scope.showLocalitiesOnMap) {
													$scope.setNearbyLocalities();
												}
												delete $scope.foreignLocalityString;
												delete $scope.foreignLocality;
											}
										});


										//map.invalidateSize(false)

									})


								})

								// End timeout





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


								$scope.observationIsValid = function() {
									var valid = true;

									if ($scope.newTaxon.length === 0 || !$scope.newTaxon[0]._id) valid = false;
									if ((!Auth.hasRole('validator')) && ($scope.determiner.length === 0 || !$scope.determiner[0]._id)) valid = false;
									if (!$scope.selectedSubstrate) valid = false;
									if (!$scope.selectedVegetationType) valid = false;
									if ($scope.users.length === 0 ) valid = false;
									if (($scope.selectedLocality.length === 0 || !$scope.selectedLocality[0]._id) && (!$scope.foreignLocality)) valid = false;

									return valid;

								}




								$scope.querySearchLocality = function(query){
									var bounds =($scope.mapsettings.markers.position) ? L.circle(L.latLng($scope.mapsettings.markers.position.lat, $scope.mapsettings.markers.position.lng), 5000).getBounds() : undefined;
									return SearchService.querySearchLocality(query, bounds)
								};
								
								$scope.querySearch = function(query){
									return SearchService.querySearchTaxon(query, $scope.onlyHigherTaxa)
								}

								$scope.querySearchPlantTaxon = SearchService.querySearchPlantTaxon;

								$scope.querySearchGBIFPlantTaxon = SearchService.querySearchGBIFPlantTaxon;

								$scope.querySearchUser = SearchService.querySearchUser;


								var mapCenter = (ObservationFormStateService.getState().mapCenter) ? ObservationFormStateService.getState().mapCenter : {
									lat: 56,
									lng: 11,
									zoom: 6
								};
								if (ObservationFormStateService.getState().mapsettings) {
									ObservationFormStateService.getState().mapsettings.markers = {};
								}
								$scope.mapsettings = (ObservationFormStateService.getState().mapsettings) ? ObservationFormStateService.getState().mapsettings : {

									center: mapCenter,
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
												name: $translate.instant('Kort'),
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



								leafletData.getMap('observationformmap').then(function(map) {
									leafletData.getLayers().then(function(layers) {
										KMS.getTicket().then(function(ticket) {
											$scope.mapsettings.layers.baselayers.topo_25 = {
												name: $translate.instant("DK 4cm kort"),
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
												name: $translate.instant("DK luftfoto"),
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



									});
									if (ObservationFormStateService.getState().currentMapLayer) {
										$scope.changeBaseLayer(ObservationFormStateService.getState().currentMapLayer)
									}
								});



								$scope.getMarkerPrecision = function(zoom) {

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
									$scope.localityOnMapButton = L.easyButton('fa-globe fa-lg', function(btn, map) {
										if (!$scope.showLocalitiesOnMap) {
											$scope.showLocalitiesOnMap = true;
											if ($scope.mapsettings.markers.position) {
												$scope.setNearbyLocalities();
											}

										} else {
											$scope.showLocalitiesOnMap = false;
											$scope.removeLocalitiesFromMap();
										}

									}).addTo(map);
									if ($scope.mapsettings.center.zoom < 11) {
										$scope.localityOnMapButton.disable();
									}

								});


								$scope.removeLocalitiesFromMap = function() {

									_.each($scope.mapsettings.markers, function(m) {
										if (m.layer === 'localities') {
											delete $scope.mapsettings.markers[m.name]
										}
									})


								};

								$scope.setNearbyLocalities = function() {

									$scope.removeLocalitiesFromMap();

									var bounds = L.circle(L.latLng($scope.mapsettings.markers.position.lat, $scope.mapsettings.markers.position.lng), 2000).getBounds();

									var q = {
										where: {}
									};
									q.where.decimalLongitude = {
										$between: [bounds.getWest(), bounds.getEast()]
									}
									q.where.decimalLatitude = {
										$between: [bounds.getSouth(), bounds.getNorth()]
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

								$scope.$on('leafletDirectiveMap.observationformmap.baselayerchange', function(event, args) {
									console.log(args.leafletEvent.name)
									var bl = args.model.layers.baselayers;
									for (var key in bl) {
										if (args.leafletEvent.name === bl[key].name) {
											$scope.currentMapLayer = key;
											break;
										}
									}


								});


								$scope.$on('leafletDirectiveMarker.observationformmap.click', function(event, args) {
									if (args.model.layer === 'localities') {
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

								$scope.resetLocalityMarkerIcons = function() {
									_.each($scope.mapsettings.markers, function(m) {
										if (m.layer === 'localities') {
											$scope.mapsettings.markers[m.name].icon = {
												type: 'awesomeMarker',
												prefix: 'fa',
												icon: 'crosshairs',
												markerColor: 'red'
											}

										}
									})
								}

								$scope.$watch('mapsettings.center.zoom', function(newVal, oldVal) {

									if (newVal && newVal !== oldVal) {
										if (newVal > 11 && GeoJsonUtils.inDK($scope.mapsettings.center)) {
											$scope.localityOnMapButton.enable();
										} else {
											$scope.localityOnMapButton.disable();
										}
									}

								});

								// geolocation
								$scope.useLocation = function() {

									leafletData.getMap('observationformmap').then(function(map) {
										map.spin(true);
										$scope.geoLocationStatusMessage = $translate.instant("Bestemmer din position ...")
										navigator.geolocation.getCurrentPosition(function(position) {
											map.spin(false);
											$scope.geoLocationStatusMessage = undefined;
											$scope.mapsettings.markers.position = {
												lat: position.coords.latitude,
												lng: position.coords.longitude,
												layer: 'position'

											}

											$scope.mapsettings.center = {
												lat: position.coords.latitude,
												lng: position.coords.longitude,
												zoom: 14
											}

											$scope.precision = position.coords.accuracy;

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
												if ($scope.showLocalitiesOnMap) {
													$scope.setNearbyLocalities();
												}
												delete $scope.foreignLocalityString;
												delete $scope.foreignLocality;
											}
										}, function(error) {
											map.spin(false);
											switch (error.code) {
												case error.PERMISSION_DENIED:
													if (error.message.indexOf("Only secure origins are allowed") === 0) {
														// Secure Origin issue.
														$scope.geoLocationStatusMessage = $translate.instant("Chrome browseren tillader ikke brug af position fra ikke-krypterede sider. Anvend i stedet") + " <a href='https://play.google.com/store/apps/details?id=org.mozilla.firefox'>Firefox</a> " + $translate.instant("eller") + " <a href='https://play.google.com/store/apps/details?id=com.opera.browser'>Opera</a>";
													} else {
														$scope.geoLocationStatusMessage = $translate.instant("Du skal give enheden lov til at bruge din position.")
													}

													break;
												case error.POSITION_UNAVAILABLE:
													$scope.geoLocationStatusMessage = $translate.instant("Positionsinformation er ikke tilgængelig.")
													break;
												case error.TIMEOUT:
													$scope.geoLocationStatusMessage = $translate.instant("Time out i bestemmelse af position.")
													break;
												case error.UNKNOWN_ERROR:
													$scope.geoLocationStatusMessage = $translate.instant("Der opstod en ukendt fejl med betemmelse af position.")
													break;
											}
										}, {
											timeout: 30000,
											enableHighAccuracy: true
										})
									})

								}

								$scope.handleUndetermined = function() {
									Taxon.get({
										id: appConstants.Fungi_id
									}).$promise.then(function(taxon) {
										$scope.newTaxon.push(taxon)
									})
								}
								$scope.openImage = function(img) {
									window.open($scope.imageurl + img.name + '.JPG', img.name, 'width=1200,height=800,resizable=1');

								}
								$scope.deleteObs = function(ev, obs) {

									var displayedId = obs.PrimaryUser.Initialer + ((obs.observationDateAccuracy !== 'invalid') ? (obs.observationDate.split('-')[0]) : '') + '-' + obs._id;

									var confirm = $mdDialog.confirm()
										.title($translate.instant('Vil du slette') + ' ' + displayedId + '?')
										.textContent($translate.instant('Fundet og alle tilhørende data vil blive permanent slettet fra databasen.'))
										.ariaLabel($translate.instant('Slet fund'))
										.targetEvent(ev)
										.ok($translate.instant('Slet'))
										.cancel($translate.instant('Fortryd'));
									$mdDialog.show(confirm).then(function() {
										Observation.delete({
											id: obs._id
										}).$promise.then(function() {
											$scope.showSimpleToast($translate.instant('Record') + ' ' + displayedId + ' ' + $translate.instant('slettet.'))
										})
									});
								};


								$scope.postComment = function(newComment) {
									$scope.sendingComment = true;
									Observation.postComment({
											id: $scope.obs._id
										}, {
											content: newComment
										})
										.$promise.then(function(comment) {
											$scope.obs.Forum.push(comment);
											delete $scope.newComment;
											$scope.sendingComment = false;
											$rootScope.$emit('observation_updated', obs);
										})
										.catch(function(err) {
											$scope.sendingComment = false;
											ErrorHandlingService.handle500();
										})

								};

								$scope.cancel = function() {
									$mdDialog.cancel();
								};

								// IMAGES
								$scope.files = [];


								$scope.selectedTabIndex = 0;

								$scope.$watch('files', function(newVal, oldVal) {
									$scope.processingImage = false;
									$scope.statusMsg = "";
									if (newVal && newVal.length > 0) {
										$scope.selectedTabIndex = 2;
									}
								})

								$scope.showProcessingImageStatus = function() {
									$scope.processingImage = true;
									$scope.statusMsg = $translate.instant("Klargør foto, et øjeblik ...");
								}


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
										}).$promise.then(function(planttaxon) {
											$scope.associatedOrganism.push(planttaxon);
											_.remove($scope.associatedOrganismImport, function(e) {
												return e.nubKey === planttaxon.gbiftaxon_id;
											})
										}))

									})

									return $q.all(promises)
								}
								$scope.deleteImg = function(img) {
									ObservationImage.delete({
										id: img._id
									}).$promise.then(function() {

										_.remove($scope.obs.Images, function(e) {
											return e._id = img._id;
										})

										$scope.showSimpleToast($translate.instant('Foto slettet'))

									})
								}

								$scope.toggleHide = function(img, hide) {

									img.hide = hide;
									ObservationImage.update({
										id: img._id
									}, img).$promise.then(function() {

										var txt = (img.hide) ? $translate.instant('Foto usynligt på taxonside') : $translate.instant('Foto synligt på taxonside')
										$scope.showSimpleToast(txt)

									})
								}

								$scope.submitObservation = function() {
									

									var obs = {
										observationDate: $filter('date')($scope.observationDate, "yyyy-MM-dd", '+0200'),
										

										substrate_id: $scope.selectedSubstrate,
										vegetationtype_id: $scope.selectedVegetationType,
										ecologynote: $scope.ecologynote,

										accuracy: $scope.precision,
										fieldnumber: $scope.fieldnumber,
										herbarium: $scope.herbarium,
										note: $scope.note,
										noteInternal: $scope.noteInternal,

										associatedOrganisms: $scope.associatedOrganism,
										associatedOrganismImport: $scope.associatedOrganismImport,
										users: _.filter($scope.users, function(u){ return u._id !== undefined })
										

									};
									
									if(!($scope.obs && $scope.obs._id)) {
										obs.os = UserAgentService.getOS();
										obs.browser = UserAgentService.getBrowser();
									}
									if($scope.users.length === 1 && $scope.users[0]._id === undefined){
										obs.verbatimLeg = $scope.users[0];
									}
									// only post determination if new observation
									if ($scope.duplicateID || !row) {
										obs.determination = {
											taxon_id: $scope.newTaxon[0]._id,
											user_id: $scope.determiner[0]._id
										};

									}

									if ($scope.selectedLocality.length === 1 && $scope.selectedLocality[0]._id) {
										obs.locality_id = $scope.selectedLocality[0]._id;

									}

									if (!$scope.mapsettings.markers.position && $scope.selectedLocality.length === 1) {

										// if the locality was chosen from the map - it is a leaflet marker with lat and lng, other wise it is a resource with decimalLatitude and decimalLongitude
										if ($scope.selectedLocality[0].layer === 'localities') {
											obs.decimalLatitude = $scope.selectedLocality[0].lat;
											obs.decimalLongitude = $scope.selectedLocality[0].lng;
										} else {
											obs.decimalLatitude = $scope.selectedLocality[0].decimalLatitude;
											obs.decimalLongitude = $scope.selectedLocality[0].decimalLongitude;
										}

										obs.accuracy = 2500;
									} else {
										obs.decimalLatitude = $scope.mapsettings.markers.position.lat;
										obs.decimalLongitude = $scope.mapsettings.markers.position.lng;
									}

									if ($scope.foreignLocality) {
										obs.geoname = $scope.foreignLocality;
										obs.verbatimLocality = $scope.foreignLocalityString;

										obs.geonameId = $scope.foreignLocality.geonameId;
									}
									// save state for next observation

									if ($scope.selectedLocality.length === 1) {
										ObservationFormStateService.getState().Locality = $scope.selectedLocality[0];
									} else if ($scope.foreignLocality) {
										ObservationFormStateService.getState().foreignLocality = $scope.foreignLocality
									};

									ObservationFormStateService.getState().observationDate = $scope.observationDate;
									ObservationFormStateService.getState().mapsettings = $scope.mapsettings;

									ObservationFormStateService.getState().currentMapLayer = $scope.currentMapLayer;


									if ($scope.ecologyLocked) {
										ObservationFormStateService.getState().ecology = {
											associatedOrganism: $scope.associatedOrganism,
											selectedVegetationType: $scope.selectedVegetationType,
											selectedSubstrate: $scope.selectedSubstrate
										}

									} else {
										delete ObservationFormStateService.getState().ecology;

									}

									// end state

									var importPromise = ($scope.associatedOrganismImport.length > 0) ? $scope.processassociatedOrganismImport() : $q.resolve();
									$scope.savingObservation = true;
									$scope.statusMsg = 'Gemmer fund...';
									importPromise.then(function() {
										if ($scope.associatedOrganism.length > 0) {
											obs.primaryassociatedorganism_id = $scope.associatedOrganism[0]._id;
										}
										return ($scope.obs && $scope.obs._id) ? Observation.update({
											id: $scope.obs._id
										}, obs).$promise : Observation.save(obs).$promise;
									})

									.then(function(obs) {
											$scope.savingObservation = false;

											if ($scope.files && $scope.files.length) {
												$scope.fileUploadInProgress = true;
												$scope.statusMsg = ($scope.files.length > 1) ? 'Sender fotos...' : 'Sender foto...';
												// or send them all together for HTML5 browsers:
												return Upload.upload({
														url: 'api/observations/' + obs._id + '/images',
														arrayKey: '',
														data: {
															file: $scope.files
														}
													})
													.then(function(resp) {
														$scope.fileUploadInProgress = false;
														console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
													}, function(resp) {
														alert("Billedet blev ikke gemt - luk venligst fundet og prøv igen.")
														console.log('Error status: ' + resp.status);
													}, function(evt) {
														var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
														$scope.fileProgress = progressPercentage;
														console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
													})
													.then(function(){
														return obs
													});
											} else {
												return obs
											}

										})
										.then(function(obs) {
											var evt = ($scope.obs && $scope.obs._id) ? 'observation_updated' : 'new_observation';
											$rootScope.$emit(evt, obs);
											$scope.newTaxon = [];
											$scope.showSimpleToast($translate.instant('Fundet blev gemt'),3000, 'bottom right')
											$scope.statusMsg = "";
											$scope.cancel();
										})
										.
									catch(function(err) {
										alert("Der er sket en fejl - luk venligst fundet og prøv igen.")
									})

								};
							}
						]);