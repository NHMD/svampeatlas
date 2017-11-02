'use strict';

angular.module('svampeatlasApp')
	.controller('SearchCtrl', ['$scope', 'ObservationSearchService', 'SearchService', 'leafletData', '$timeout', '$mdUtil', '$mdSidenav', '$mdMedia', '$state', 'Auth', '$translate', '$filter', 'Area','StoredSearch', 'StoredSearchModalService', '$stateParams', 'appConstants', '$cookies', 'KMS', 'MapBox',
		function($scope, ObservationSearchService, SearchService, leafletData, $timeout, $mdUtil, $mdSidenav, $mdMedia, $state, Auth, $translate, $filter, Area, StoredSearch, StoredSearchModalService, $stateParams, appConstants, $cookies, KMS, MapBox) {
			$scope.baseUrl = appConstants.baseurl;
			$scope.appConstants = appConstants;
			$scope.Auth = Auth;
			$scope.state = $state;
			$scope.$cookies = $cookies;
			$scope.mdMedia = $mdMedia;
			$scope.$translate = $translate;
			$scope.AcceptedDeterminationScore = appConstants.AcceptedDeterminationScore;
			$scope.ProbableDeterminationScore = appConstants.ProbableDeterminationScore;
			
			$scope.setDate = function(days, model) {
				ObservationSearchService.setDate(days, model, $scope.search);
			};
			$scope.toggleSearchMapSideNav = buildToggler('searchmapsidenav');
			
			SearchService.getSubstrate().then(function(substrates){
				$scope.substrates = substrates;
			});
			
			SearchService.getVegetationType().then(function(vegtypes){
				$scope.vegetationtypes = vegtypes;
			})
			SearchService.getDataSet().then(function(dataSet){
				$scope.dataSet = dataSet;
								
			})
			
			$scope.StoredSearchModalService = StoredSearchModalService;
			
	  	  $scope.openMenu = function($mdOpenMenu, ev) {
     
	        $mdOpenMenu(ev);
	      };
		  
		 

		  $scope.showStoredSearch = function(search){
			  
			  
  					StoredSearch.get({id: search._id}).$promise.then(function(ss){
						$scope.storedSearch = ss;
  						ObservationSearchService.reset();
  						$scope.observationSearch = ObservationSearchService.getSearch();
  						if (!$scope.observationSearch.where) {
  							$scope.observationSearch.where = {};
  						}
  						$scope.search= JSON.parse(ss.search);
  						ObservationSearchService.convertSearchDateStrings($scope.search)
  						$scope.search.selectedHigherTaxa = $scope.search.selectedHigherTaxa || [];
  						$scope.search.selectedLocalities = $scope.search.selectedLocalities || [];
  						$scope.search.associatedOrganism = $scope.search.associatedOrganism || [];
  						$scope.search.collectors = $scope.search.collectors || [];
  						$scope.search.determiner = $scope.search.determiner || [];
  						$scope.search.PrimaryUser = $scope.search.PrimaryUser || [];
  						$scope.search.selectedMonths = $scope.search.selectedMonths || [];
						$scope.search.Determination_score = $scope.search.Determination_score || [];
						$scope.search.Determination_validation = $scope.search.Determination_validation || [];
						
						/*if($scope.search.geometry){
							$scope.leafletPolygon = new L.geoJson($scope.search.geometry);
							$scope.drawnItems.addLayer($scope.leafletPolygon)
						} */
						
  						 if($scope.search.geometry){
							
  							leafletData.getMap('searchformmap').then(function(map) {
								$scope.drawnItems.clearLayers();
								$scope.drawnItems.addData($scope.search.geometry); 
							
				
  							})
							
							
  						} 
						ObservationSearchService.uiSearchToDBquery($scope.search, $scope.observationSearch)
						// flag that the search is stored to set the seacrh id as path param. This is postponed 100 millisec so it is not deleted by the watch on $scope.search
						$timeout(function(){
							ObservationSearchService.storedSearch = search;
						}, 100)
						
  					})
	
		  }
		  
		  $scope.deleteStoredSearch = function(search){
				StoredSearch.remove({
					id: search._id
				}).$promise.then(function(){
						$scope.storedSearches = StoredSearch.query()
				})
		  }
		  
		  if($stateParams.searchid){
		  	$scope.showStoredSearch({_id: $stateParams.searchid})
		  }


		
			
			
			$scope.openMenu = function($mdOpenMenu, ev) {

				$mdOpenMenu(ev);
			};
			
			$scope.storedSearches = StoredSearch.query()

			$scope.resetForm = function() {
				
				
					ObservationSearchService.reset();
					/*
					$scope.search = ObservationSearchService.getSearch();
					$scope.search.selectedHigherTaxa = [];
					$scope.search.selectedLocalities = [];
					$scope.search.associatedOrganism = [];
					$scope.search.collectors = [];
					$scope.search.determiner= [];
					$scope.search.PrimaryUser= [];
					$scope.search.selectedMonths =  [];
					
					delete $scope.search.fromYear;
					delete $scope.search.toYear;
					delete $scope.search.geometry;
					delete $scope.search.databasenumber;
					if($scope.drawnItems){
						$scope.drawnItems.removeLayer($scope.leafletPolygon);
					}
				*/
					if($scope.drawnItems){
						$scope.drawnItems.removeLayer($scope.leafletPolygon);
					}
					$state.reload();
	
					
				}
				
				
				if(ObservationSearchService.getSearch().wasInitiatedOutsideSearchForm)	{
					$scope.resetForm();
				}
	
				/**
				 * Build handler to open/close a SideNav; when animation finishes
				 * report completion in console
				 */

			function buildToggler(navID) {
				var debounceFn = $mdUtil.debounce(function() {
					$mdSidenav(navID)
						.toggle()
						.then(function() {
							leafletData.getMap('searchformmap').then(function(map) {
								map.invalidateSize()
							})
						})

				}, 200);
				return debounceFn;
			}

			$scope.closeSideNav = function(nav) {
				$mdSidenav(nav).close()

			};
			
			$scope.setMunicipality = function(id){
				
				var area = _.find($scope.municipalities, function(m){
					return m._id === parseInt(id);
				})
				
				Area.geometry({id: area._id}).$promise.then(function(geo){
					leafletData.getMap('searchformmap').then(function(map) {
						
						if($scope.municipality){
							map.removeLayer($scope.municipality);
						};
						$scope.municipality = new L.geoJson(geo);
						map.addLayer($scope.municipality);
						map.fitBounds($scope.municipality.getBounds());
						//$scope.search.municipalityid = area._id;
					//	$scope.search.include[2].where.municipality_id = area._id
						$scope.search.include[7].where.area_id = area._id
					});
					
				})
			}
			
			$scope.deleteMunicipality = function(){
				leafletData.getMap('searchformmap').then(function(map) {
				if($scope.municipality){
					map.removeLayer($scope.municipality);
				};
				delete $scope.municipality ;
				
				delete $scope.search.include[2].where.municipality_id
				delete $scope.search.selectedMunicipality;
			});
			}
			
			$scope.utm10polygons = [];
			//	ObservationSearchService.reset();
			$scope.search = ObservationSearchService.getUIstate();

			//	L.drawLocal.draw.toolbar.buttons.polygon = 'Tegn polygon';

			if ($scope.search.geometry) {
				$scope.drawnItems = new L.geoJson($scope.search.geometry);

			} else {
				$scope.drawnItems = new L.geoJson();
			};
			
			
			SearchService.getMunicipalities().then(function(municipalities){
				$scope.municipalities = municipalities;
				if ($scope.search.include[2].where.municipality_id) {
					$scope.search.selectedMunicipality = parseInt($scope.search.include[2].where.municipality_id);
				}
					
				
			})
			
			
			

			
			$scope.mapsettings = {
				center: {
					lat: 56,
					lng: 11.5,
					zoom: 6
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
		//	var mapControls = {};
			function initMap(){
				leafletData.getMap('searchformmap').then(function(map) {
					$scope.map = map;
					map.addLayer($scope.drawnItems);

					var drawControl = new L.Control.Draw({
						edit: {
							featureGroup: $scope.drawnItems
						},
						draw: {
							polyline: false,
							circle: false,
							marker: false,
							rectangle: false
						}

					});

					var editControl = new L.Control.Draw({
						edit: {
							featureGroup: $scope.drawnItems
						},
						draw: {
							polyline: false,
							circle: false,
							marker: false,
							rectangle: false,
							polygon: false
						}

					});
					if ($scope.drawnItems.getLayers().length === 0) {
						map.addControl(drawControl);
					} else {
					//	map.addControl(editControl);
					}



					map.on('draw:created', function(e) {
						var type = e.layerType,
							layer = e.layer;

						// Do whatever else you need to. (save to db, add to map etc)
							$scope.leafletPolygon = 	layer;
							$scope.drawnItems.clearLayers();
						$scope.drawnItems.addLayer(layer);
					//	map.removeControl(drawControl);
						//map.addControl(editControl);

						$scope.search.geometry = layer.toGeoJSON();
					});

					map.on('draw:edited', function(e) {
						var layer = $scope.drawnItems.getLayers()[0];

						$scope.search.geometry = layer.toGeoJSON();
					});

					map.on('draw:deleted', function(e) {


						delete $scope.search.geometry;

						//map.removeControl(editControl);
						//map.addControl(drawControl);
					});
					SearchService.getUTM10().then(function(polygons){
						
						
						
						
						
						$scope.utm10OnMapButton = L.easyButton('fa-th fa-lg', function(btn, map) {
							
							$scope.toogleUtm10(polygons, map);
						}).addTo(map);
						
					});
			
					
					

				})
			}

			$scope.toogleUtm10 = function(polygons,map){
				
				var onPolyClick = function(event){
				    //callFancyboxIframe('flrs.html')
				    var label = event.target.options.label;
				    var _id = event.target.options._id;
					event.target.options.isSelected = !event.target.options.isSelected ;
					//var fillColor = (event.target.options.isSelected) ? '#FF0000' : '#0000FF';
					if(event.target.options.isSelected){
						event.target.setStyle({color: '#FF0000', fillColor: '#FF0000', weight: 5});
						$scope.search.utm10.push(event.target.options)
		
						
					} else {
						event.target.setStyle({color: '#0000FF', fillColor: '#0000FF', weight: 2});
						
						for(var i=0; i < $scope.search.utm10.length; i++){
							if($scope.search.utm10[i]._id === event.target.options._id){
								$scope.search.utm10.splice(i, 1);
							}
						}
					}
		
				};
				
				
				if (!$scope.showUTM10OnMap) {
					$scope.showUTM10OnMap = true;
					if( $scope.utm10polygons.length ===0){
						for(var i=0; i < polygons.length; i++){
							var poly ;
							
							if($scope.search.utm10.length > 0){
								var opts = {'isSelected': false, 'label': polygons[i].name, '_id': polygons[i]._id, weight: 2};
								for(var j=0; j < $scope.search.utm10.length; j++){
									if($scope.search.utm10[j]._id === polygons[i]._id){
										opts = {'isSelected': true, color: '#FF0000', fillColor: '#FF0000', weight: 5, 'label': polygons[i].name, '_id': polygons[i]._id};
										break;
									}
								}
								poly = new L.geoJson(polygons[i].geom, opts);
							} else {
								poly = new L.geoJson(polygons[i].geom, {'isSelected': false, 'label': polygons[i].name, '_id': polygons[i]._id, weight: 2});
							}
							$scope.utm10polygons.push(poly);
							map.addLayer(poly)
						
						
							poly.on('click', onPolyClick);
						}
					} else {
						for(var i=0; i < $scope.utm10polygons.length; i++){
							map.addLayer($scope.utm10polygons[i])
						}
					}
					

				} else {
					$scope.showUTM10OnMap = false;
					for(var i=0; i < $scope.utm10polygons.length; i++){
						var poly = $scope.utm10polygons[i];
						
						map.removeLayer(poly);
						
					};
					
				}
			}

			initMap();
			
			if($scope.search.utm10.length > 0){
				SearchService.getUTM10().then(function(polygons){
					leafletData.getMap('searchformmap').then(function(map){
						$scope.toogleUtm10(polygons, map)
					})
				})
			}

			$scope.$watch('search.selectedMunicipality', function(newVal, oldVal){
				
				if(newVal ){
					//var area = JSON.parse(newVal)
					$scope.setMunicipality(newVal)
				}
			})



			$scope.querySearchLocality = SearchService.querySearchLocality;

			$scope.querySearch = function(query) {
				return SearchService.querySearchTaxon(query, $scope.search.onlyHigherTaxa)
			}


			$scope.querySearchUser = SearchService.querySearchUser;

			$scope.taxonPlaceholder = $translate.instant("Latinsk navn");


			$scope.observationSearch = ObservationSearchService.getSearch();
			if (!$scope.observationSearch.where) {
				$scope.observationSearch.where = {};
			}

			$scope.resetSection = function(section) {

				switch (section) {
					case "taxonomy":
						
						$scope.search.selectedHigherTaxa = [];
						$scope.search.onlyHigherTaxa = false;
						delete $scope.search.include[0].where.Taxon_redlist_status;
						break;
					case 'geography':
						$scope.search.onlyForeign = false;
						$scope.search.includeForeign = false;
						$scope.search.selectedLocalities = [];
						delete $scope.observationSearch.geometry;
						$scope.drawnItems.removeLayer($scope.leafletPolygon);
						$scope.deleteMunicipality()
						break;
					case 'period':
						delete $scope.search.fromDate;
						delete $scope.search.toDate;
						delete $scope.search.fromYear;
						delete $scope.search.toYear;
						$scope.search.exactDate = false;
						delete $scope.search.addedFromDate;
						delete $scope.search.addedToDate;
						$scope.search.addedExactDate = false;
						$scope.search.selectedMonths = [];
						break;
					case 'ecology':
						delete $scope.search.livsstrategi;
						delete $scope.search.selectedSubstrate;
						delete $scope.search.selectedVegetationType;
						$scope.search.associatedOrganism = [];
						break;
					case 'persons':
						$scope.search.collectors = [];
						$scope.search.determiner = [];
						$scope.search.PrimaryUser = [];
						$scope.search.onlyMyObservations = false;
						$scope.search.notMyObservations = false;
						break;
					case 'recordproperties':
						$scope.search.Determination_validation = [];
						$scope.search.Determination_score = [];
						delete $scope.search.fieldnumber;
						delete $scope.search.databasenumber
						delete $scope.search._id;
						delete $scope.search.selectedDataSet;
						$scope.search.onlyWithImages = false;
						delete $scope.search.imageMaxAge;

						break;
					case 'forum':
						delete $scope.search.onlyWithForum;
						delete $scope.search.activeThreadsOnly;
						delete $scope.search.forumMaxAge;
						
						delete $scope.search.forumComment;
						

						break;

				}

			}



			if (!$scope.search.include) {
				$scope.search.include = ObservationSearchService.getNewSearch().include;
			}
			


			$scope.strategiesUI = [{
				en: 'mycorrhizal',
				dk: 'mykorrhizadannende',
				key: 'mycorrhizal'
			}, {
				en: 'lichenized',
				dk: 'lavdanner',
				key: 'lichenized'
			}, {
				en: 'Not lichenized',
				dk: 'Ikke lavdanner',
				key: 'not_lichenized'
			}, {
				en: 'parasite on lichens',
				dk: 'parasit på laver',
				key: 'parasite_on_lichens'
			}, {
				en: 'saprobe on wood',
				dk: 'nedbryder på træ',
				key: 'saprobe_on_wood'
			}]
			$scope.strategies =  ObservationSearchService.strategies; //['mycorrhizal', 'lichenized', 'parasite', 'saprobe', 'on_lichens', 'on_wood']
			$scope.search.selectedHigherTaxa = $scope.search.selectedHigherTaxa || [];
			$scope.search.selectedLocalities = $scope.search.selectedLocalities || [];
			$scope.search.associatedOrganism = $scope.search.associatedOrganism || [];
			$scope.search.collectors = $scope.search.collectors || [];
			$scope.search.determiner = $scope.search.determiner || [];
			$scope.search.PrimaryUser = $scope.search.PrimaryUser || [];
			$scope.search.selectedMonths = $scope.search.selectedMonths || [];
			$scope.search.Determination_score = $scope.search.Determination_score  || [];
			$scope.querySearchPlantTaxon = SearchService.querySearchPlantTaxon;

			$scope.setAccuracy = function(){
				if($scope.minAccuracy && maxAccuracy){}
			}
			$scope.setFromYear = function(year) {
				$scope.search.fromDate = new Date(year, 0, 1);
			}

			$scope.setToYear = function(year) {
				$scope.search.toDate = new Date(year, 11, 31);
			}
			//$scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			$scope.months = _.map(moment.localeData()._months, function(val, key){
				return {id: parseInt(key+1) , name: val}
			});
			/*
			$scope.toggle = function(item, list) {
				var idx = list.indexOf(item);
				if (idx > -1) {
					list.splice(idx, 1);
				} else {
					list.push(item);
				}
			};
			$scope.exists = function(item, list) {
				return list && list.indexOf(item) > -1;
			};
			*/
			//observationSearch.where.observationDate.$between[0]
			$scope.$watch('search', function(newVal, oldVal) {
				 // if there is a search id delete it (will be set after 100 millisec when a stored search is selected or created)
				delete ObservationSearchService.storedSearch;
				ObservationSearchService.uiSearchToDBquery(newVal, $scope.observationSearch)

			}, true)
		}
	]);
