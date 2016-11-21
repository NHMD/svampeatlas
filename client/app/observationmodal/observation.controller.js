'use strict';

angular.module('svampeatlasApp')
	.controller('ObservationCtrl', ['$scope', '$rootScope','$window', 'Auth', 'ErrorHandlingService', '$mdPanel','$mdDialog', '$mdSidenav', 'ssSideNav', 'Observation', 'Determination', '$mdMedia', '$mdToast', 'leafletData', 'KMS', 'MapBox', '$timeout', 'DeterminationModalService', 'ObservationFormService', '$translate', '$state', '$stateParams', 'appConstants', 'ObservationStateService','$cookies', 'ObservationImage', 'Taxon',
		function($scope, $rootScope,$window, Auth, ErrorHandlingService,$mdPanel, $mdDialog, $mdSidenav, ssSideNav, Observation, Determination, $mdMedia, $mdToast, leafletData, KMS, MapBox, $timeout, DeterminationModalService, ObservationFormService, $translate, $state, $stateParams, appConstants, ObservationStateService, $cookies, ObservationImage, Taxon) {
			var that = this;
			$scope.mdSidenav = $mdSidenav;
			$scope.menu = ssSideNav;
			$scope.openSideNav = function() {

				$scope.menu.userHasForceClosed = false;

				$mdSidenav('left').open();
			}
			$scope.openMenu = function($mdOpenMenu, ev) {

				$mdOpenMenu(ev);
			};
			$scope.$translate = $translate;
			$scope.$state = $state;
			
			$scope.showDeterminationsPanel = function(evt) {
			  var position = $mdPanel.newPanelPosition()
			      .absolute()
			      .center();
				 
			  var config = {
			    attachTo: angular.element(document.body),
			    controller: 'DeterminationPanelCtrl',
				locals: {
					obs: $scope.obs
				},
			    controllerAs: 'ctrl',
			    disableParentScroll: true,
			    templateUrl: 'app/observationmodal/determination-panel.tpl.html',
			    hasBackdrop: true,
			    panelClass: 'demo-dialog-example',
			    position: position,
			    trapFocus: true,
			    zIndex: 150,
			    clickOutsideToClose: true,
			    escapeToClose: true,
			    focusOnOpen: true,
				animation:   $mdPanel.newPanelAnimation()
				  .openFrom('#determinations-btn')
				  .closeTo('#determinations-btn')
				  .withAnimation($mdPanel.animation.SCALE)
			  };
			  
			  
			  
			  $mdPanel.open(config);
			};
			
			$scope.toggleHide = function(img, hide) {

				img.hide = hide;
				ObservationImage.update({
					id: img._id
				}, img).$promise.then(function() {

					var txt = (img.hide) ? $translate.instant('Foto usynligt på taxonside') : $translate.instant('Foto synligt på taxonside')
					$scope.showSimpleToast(txt)

				})
			}
		
			
			
			$scope.addToSpeciesPage = function(img) {
				
				var taxonImage = {
					taxon_id: $scope.obs.PrimaryDetermination.Taxon.acceptedTaxon._id,
					collectionNumber: "DMS-"+$scope.obs._id,
					uri: appConstants.baseurl+"/uploads/"+img.name+".JPG",
					thumburi: appConstants.baseurl+"/uploads/"+img.name+".JPG",
					photographer: img.Photographer.name,
					country: ($scope.obs.Locality) ? "Denmark" : $scope.obs.GeoNames.countryName
					
				}
				
				Taxon.addImage({
					id: $scope.obs.PrimaryDetermination.Taxon.acceptedTaxon._id
				}, taxonImage).$promise.then(function(image) {

					$mdDialog.cancel();
					$state.go($state.$current, null, {
						reload: true
					})
					

				})

			}
			
			
			$scope.showUser= function(id){
				$mdDialog.cancel();
				$state.go('userstats', {userid: id});
			}

			
			$scope.editRecord = function(asDuplicate) {
				$mdDialog.hide($scope.obs).then(function(obs) {
					ObservationFormService.show(null, obs, asDuplicate)
				})
			}


			//	$scope.referencedDataRow = referencedDataRow;
			$scope.User = Auth.getCurrentUser();
			$scope.isLoggedIn = Auth.isLoggedIn;
			$scope.Auth = Auth;
			$scope.showSimpleToast = function(text) {

				$mdToast.show(
					$mdToast.simple()
					.textContent(text)
					.position("top right")
					.parent(document.querySelectorAll('.speeddial-parent'))
					.hideDelay(3000)
				);
			};
			$scope.openImage = function(img) {
				window.open($scope.imageurl + img.name + '.JPG', img.name, 'width=1200,height=800,resizable=1');

			}
			$scope.deleteObs = function(ev, obs) {

				//var displayedId = obs.PrimaryUser.Initialer + ((obs.observationDateAccuracy !== 'invalid') ? (obs.observationDate.split('-')[0]) : '') + '-' + obs._id;
				var displayedId = 'DMS-' + obs._id;
				
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
						$rootScope.$broadcast('observation_deleted', $scope.obs);
						$scope.showSimpleToast($translate.instant('Record') + ' ' + displayedId + ' ' + $translate.instant('slettet.'))
					})
				});
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

			var sender = ($stateParams.observationid) ? 'ObservationPage' : 'ObservationModalService';
			$scope.showDeterminationDialog = function($event, obs) {
				DeterminationModalService.show($event, obs, sender);
			}
			$scope.showDeterminationEditDialog = function($event, obs) {
				DeterminationModalService.show($event, obs, sender, true);
			}


			$scope.postComment = function() {
				that.sendingComment = true;
				Observation.postComment({
						id: $scope.obs._id
					}, {
						content: that.newComment
					})
					.$promise.then(function(comment) {
						$scope.forum.push(comment);
						delete that.newComment;
						
						that.sendingComment = false;


						$rootScope.$broadcast('observation_updated', $scope.obs);
					})
					.catch(function(err) {
						that.sendingComment = false;
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
							name: $translate.instant('Kort'),
							url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
							type: 'xyz'
						},
						OpenTopoMap: {
							name: 'OpenTopoMap',
							url: 'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
							type: 'xyz',
							layerOptions: {
								
								attribution: 'Tiles &copy; opentopomap.org'
							}

						},
						mapbox_outdoors: {
							name: 'Mapbox Outdoors',
							url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token='+MapBox.getTicket(),
							type: 'xyz'

						},
						mapbox_satelite: {
							name: 'Mapbox Satelite',
							url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token='+MapBox.getTicket(),
							type: 'xyz'

						},
						/*
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

*/

					}
				}
			};

			KMS.getTicket().then(function(ticket) {
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
			})


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

			$scope.addingUser = false;
			$scope.addFinder = function(obs, usr) {
				$scope.addingUser = true;
				Observation.addUser({
					id: obs._id
				}, usr).$promise.then(function() {
					$scope.addingUser = false;
					obs.users.push(usr)
					$scope.showSimpleToast(usr.name + " " + $translate.instant('tilføjet som finder'))

				})


			}
			$scope.removeFinder = function(obs, usr) {
				$scope.addingUser = true;
				$scope.addUserPromise = Observation.removeUser({
					id: obs._id,
					userid: usr._id
				}).$promise.then(function() {
					$scope.addingUser = false;
					_.remove(obs.users, function(u) {
						return u._id === usr._id
					});
					$scope.showSimpleToast(usr.name + " " + $translate.instant('fjernet fra findere'))

				})

			}



			var obsid = ($stateParams.observationid) ? $stateParams.observationid : ObservationStateService.get()._id;
			$scope.obs = Observation.get({
				id: obsid
			});

			$rootScope.$on('observation_updated', function(evt, obs) {
				if (obs._id === $scope.obs._id) {
					$state.reload();
				}
			});

			$scope.obs.$promise.then(function(obs) {

				$scope.userIsFinder = function(usr) {
					var found = false;
					for (var i = 0; i < $scope.obs.users.length; i++) {
						if (usr._id === $scope.obs.users[i]._id) found = true;
					};
					return found;
				}

				$scope.forum = obs.Forum

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
				var zoom = parseInt(obs.accuracy) > 10000 ? 8 : parseInt(obs.accuracy) <= 10000 && parseInt(obs.accuracy) >= 5000 ? 10 : parseInt(obs.accuracy) < 5000 && parseInt(obs.accuracy) >= 2000 ? 12 : parseInt(obs.accuracy) < 2000 && parseInt(obs.accuracy) >= 500 ? 13 : parseInt(obs.accuracy) < 500 && parseInt(obs.accuracy) >= 250 ? 14 : parseInt(obs.accuracy) < 250 && parseInt(obs.accuracy) >= 100 ? 15 : 16;

				$scope.mapsettings.center = {
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
					if (obs.Locality) {

						$scope.changeBaseLayer("topo_25")


					} 
					$timeout(function() {
						map.invalidateSize();
					});
					//map.invalidateSize(false)

				})

			})

			$scope.imageurl = appConstants.imageurl;
			$scope.baseUrl = appConstants.baseurl;
			$scope.loaded = {};
			$scope.failed = {};
			$scope.imageHasLoaded = function(img) {
				$scope.loaded[img] = true;

			};
			$scope.imageHasFailed = function(img) {
				$scope.failed[img] = true;

			};
			$scope.cancel = function() {
				ObservationStateService.reset();
				$mdDialog.cancel();
			};


		}
	])
