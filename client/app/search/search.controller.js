'use strict';

angular.module('svampeatlasApp')
	.controller('SearchCtrl', ['$scope', 'ObservationSearchService', 'Taxon', 'TaxonDKnames', 'Locality', 'Substrate', 'VegetationType', 'PlantTaxon', 'leafletData', '$timeout', '$mdUtil', '$mdSidenav', '$mdMedia', '$state', 'Auth', '$translate', '$filter',
		function($scope, ObservationSearchService, Taxon, TaxonDKnames, Locality, Substrate,VegetationType, PlantTaxon, leafletData, $timeout, $mdUtil, $mdSidenav, $mdMedia, $state, Auth, $translate, $filter) {
			$scope.Auth = Auth;
			$scope.state = $state;
			$scope.mdMedia = $mdMedia;
			$scope.$translate = $translate;
			$scope.toggleSearchMapSideNav = buildToggler('searchmapsidenav');
			
			$scope.substrates = Substrate.query();
			$scope.vegetationtypes = VegetationType.query();
			
	  	  $scope.openMenu = function($mdOpenMenu, ev) {
     		 
	        $mdOpenMenu(ev);
	      };
			
			$scope.resetForm = function() {

				ObservationSearchService.reset();
				$state.reload();
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
			//	ObservationSearchService.reset();
			$scope.search = ObservationSearchService.getUIstate();

			//	L.drawLocal.draw.toolbar.buttons.polygon = 'Tegn polygon';

			if ($scope.search.geometry) {
				$scope.drawnItems = new L.geoJson($scope.search.geometry);

			} else {
				$scope.drawnItems = new L.geoJson();
			};
			$scope.mapsettings = {
				center: {
					lat: 56,
					lng: 11,
					zoom: 6
				},


				layers: {
					baselayers: {
						osm: {
							name: 'OpenStreetMap',
							url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
							type: 'xyz'
						}
					}
				}
			};



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
					map.addControl(editControl);
				}



				map.on('draw:created', function(e) {
					var type = e.layerType,
						layer = e.layer;

					// Do whatever else you need to. (save to db, add to map etc)
					$scope.drawnItems.addLayer(layer);
					map.removeControl(drawControl);
					map.addControl(editControl);

					$scope.search.geometry = layer.toGeoJSON();
				});

				map.on('draw:edited', function(e) {
					var layer = $scope.drawnItems.getLayers()[0];

					$scope.search.geometry = layer.toGeoJSON();
				});

				map.on('draw:deleted', function(e) {


					delete $scope.search.geometry;

					map.removeControl(editControl);
					map.addControl(drawControl);
				});

			})







			$scope.querySearchLocality = function(query) {


				var results = query ? Locality.query({
					where: {
						name: {
							like: "%" + query + "%"
						}
					},
					limit: 30

				}).$promise.then(function(data){
					return _.map(data, function(d){
						return d.name
					})
				}) : [];

				return results;
			}

			$scope.querySearch = function(query) {
				if ($scope.search.DkNames === true) {
					return $scope.querySearchDkNames(query)
				} else {
					var RankID = ($scope.search.onlyHigherTaxa) ? {
						lt: 10000
					} : {
						gt: 5000
					};
					var parts = query.split(' ');
					var where = ($scope.search.threePlusThree && !$scope.search.onlyHigherTaxa && parts.length > 1 ) ? {
						FullName: {
							like: parts[0] + "%"
						},
						TaxonName: {
							like: parts[1] + "%"
						},
						RankID: RankID

					} : {
						FullName: {
							like: "%" + query + "%"
						},
						RankID: RankID

					};
					
					

					var results = query ? Taxon.query({
						where: JSON.stringify(where),
						include: JSON.stringify([{
							model: "Taxon",
							as: 'acceptedTaxon'
						}]),
						limit: 30

					}).$promise : [];

					return results;
				}
			}

			$scope.querySearchDkNames = function(query) {
				var RankID = ($scope.search.onlyHigherTaxa) ? {
					lt: 10000
				} : {
					gt: 5000
				};
				var where = {
					vernacularname_dk: {
						like: "%" + query + "%"
					}

				};

				var results = query ? TaxonDKnames.query({
					where: JSON.stringify(where),
					include: JSON.stringify([{
						model: "Taxon",
						as: "taxon",
						where: JSON.stringify({
							RankID: RankID
						})
					}]),
					limit: 30

				}).$promise : [];

				return results;
			}

			$scope.taxonPlaceholder = $translate.instant("Latinsk navn");


			$scope.observationSearch = ObservationSearchService.getSearch();
			if (!$scope.observationSearch.where) {
				$scope.observationSearch.where = {};
			}

			//	$scope.search.includeForeign = false;
			/*	
		for (var i = 0; i < parsedCharacters.length; i++) {

			include.push({
				model: "MycokeyCharacterView",
				as: "character" + i,
				where: JSON.stringify({
					CharacterID: parsedCharacters[i].CharacterID
				})
			})
			
		}
		
*/
			if (!$scope.search.include) {
				$scope.search.include = [{
					model: "DeterminationView",
					as: "DeterminationView",
					attributes: ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName'],
					where: { Determination_validation: ['Godkendt','Valideres', 'Afventer', 'Gammelvali']}
				}, {
					model: "User",
					as: 'PrimaryUser',
					//	attributes: ['email', 'Initialer', 'name'],
					required: false,
					where: {}
				}, {
					model: "Locality",
					as: 'Locality',
					where: {},
					required: true
				}, {
					model: "GeoNames",
					as: 'GeoNames',
					where: {},
					required: false
				}];
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
			$scope.strategies = ['mycorrhizal', 'lichenized', 'parasite', 'saprobe', 'on_lichens', 'on_wood']
			$scope.search.selectedHigherTaxa = $scope.search.selectedHigherTaxa || [];
			$scope.search.selectedLocalities = $scope.search.selectedLocalities || [];
			$scope.search.associatedOrganism = $scope.search.associatedOrganism || [];
			
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
					limit: 30,
					order: "probability DESC"
				}).$promise : [];

				return results;

			};
			
			
			$scope.setFromYear = function(year){
				$scope.search.fromDate = new Date(year, 0, 1);
			}
			
			$scope.setToYear = function(year){
				$scope.search.toDate = new Date(year, 11, 31);
			}
			$scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
			$scope.search.selectedMonths = $scope.search.selectedMonths || [];
			      $scope.toggle = function (item, list) {
			        var idx = list.indexOf(item);
			        if (idx > -1) {
			          list.splice(idx, 1);
			        }
			        else {
			          list.push(item);
			        }
			      };
				  $scope.exists = function (item, list) {
				          return list.indexOf(item) > -1;
				        };
			//observationSearch.where.observationDate.$between[0]
			$scope.$watch('search', function(newVal, oldVal) {


				if (newVal.livsstrategi) {

					_.each($scope.strategies, function(n) {
						delete $scope.search.include[0].where[n]
					})

					switch (newVal.livsstrategi) {
						case "mycorrhizal":
							$scope.search.include[0].where.mycorrhizal = 1;
							break;
						case "lichenized":
							$scope.search.include[0].where.lichenized = 1;
							break;
						case "not_lichenized":
							$scope.search.include[0].where.lichenized = 0;
							break;
						case "parasite_on_lichens":
							$scope.search.include[0].where.parasite = 1;
							$scope.search.include[0].where.on_lichens = 1;
							break;
						case "saprobe_on_wood":
							$scope.search.include[0].where.saprobe = 1;
							$scope.search.include[0].where.on_wood = 1;
							break;


					}

				}
				
				if($scope.search.selectedVegetationType){
					$scope.observationSearch.where.vegetationtype_id = $scope.search.selectedVegetationType;
				} else {
					delete $scope.observationSearch.where.vegetationtype_id;
				}
				
				if($scope.search.selectedSubstrate){
					$scope.observationSearch.where.substrate_id = $scope.search.selectedSubstrate;
				} else {
					delete $scope.observationSearch.where.substrate_id;
				}
				

				if (newVal.DkNames === true) {
					$scope.taxonPlaceholder = $translate.instant("Dansk navn");
				} else {
					$scope.taxonPlaceholder = $translate.instant("Latinsk navn");
				}
				
				
				
				if($scope.search.onlyForeign){
					$scope.search.include[2].required = false;
					$scope.observationSearch.where.locality_id = null;
				} else {
					delete $scope.observationSearch.where.locality_id;
					$scope.search.include[2].required = ($scope.search.geometry) ? false : !$scope.search.includeForeign;
				}
				
				if($scope.search.finder) {
					$scope.search.include[1].where.name = { like : "%"+$scope.search.finder+"%"}
				} else {
					delete $scope.search.include[1].where.name;
				}

				if ($scope.search.selectedHigherTaxa.length > 0) {
					$scope.search.include[0].where.$or = _.map($scope.search.selectedHigherTaxa, function(tx) {
						if (tx.taxon) {
							// its a DK name with a taxon attached to it
							var path = tx.taxon.Path;
							return {
								Taxon_path: {
									like: path + "%"
								}
							}

						} else {
							// its a taxon resource
							var path = (tx.acceptedTaxon === null) ? tx.Path : tx.acceptedTaxon.Path;
							return {
								Taxon_path: {
									like: path + "%"
								}
							}
						}
					})
				} else {
					delete $scope.search.include[0].where.$or;
				}


				if ($scope.search.selectedLocalities.length > 0) {
					$scope.search.include[2].where.$or = _.map($scope.search.selectedLocalities, function(loc) {
						return {
							name: {
								like: loc + "%"
							}
						}
					})
				} else {
					delete $scope.search.include[2].where.$or;
				}
				

				/*
				if ($scope.search.include[0].where.Taxon_redlist_status === "ALL") {
					$scope.search.include[0].where.Taxon_redlist_status = ['RE', 'CR', 'EN', 'VU', 'NT']
				}
				*/
				// clean empty strings from where clauses
				for (var i = 0; i < $scope.search.include.length; i++) {
					_.each($scope.search.include[i].where, function(val, key) {
						if (val === "") {
							delete $scope.search.include[i].where[key];
						}
					})
				}
				
				
				if($scope.search.include[1].where.Initialer  || $scope.search.finder){
					$scope.search.include[1].required = true;
				} else {
					$scope.search.include[1].required = false;
				}
				
				
				$scope.observationSearch.include = $scope.search.include;
				
				
				if ($scope.search.associatedOrganism.length > 0) {
					$scope.observationSearch.where.primaryassociatedorganism_id = {$in: _.map($scope.search.associatedOrganism, function(org) {
						return org._id
					})}
					
					
				} else {
					delete $scope.observationSearch.where.primaryassociatedorganism_id;
				}
				
				
				
				if ($scope.search.onlyMyObservations) {
					$scope.observationSearch.where.primaryuser_id = Auth.getCurrentUser()._id
				} 
				
				if ($scope.search.notMyObservations) {
					$scope.observationSearch.where.primaryuser_id = {$ne: Auth.getCurrentUser()._id}
				} 
				if(!$scope.search.onlyMyObservations && !$scope.search.notMyObservations){
					delete $scope.observationSearch.where.primaryuser_id;
				}
				
				if ($scope.search.databasenumber) {
					$scope.observationSearch.where._id = $scope.search.databasenumber.split("-")[1] || $scope.search.databasenumber;
					$scope.observationSearch.include[2].required = false;
					delete $scope.observationSearch.include[0].where.Determination_validation ;
					
				} else {
					delete $scope.observationSearch.where._id;
					$scope.observationSearch.include[0].where.Determination_validation = $scope.search.include[0].where.Determination_validation;
				}
				if ($scope.search.fieldnumber) {
					$scope.observationSearch.where.fieldnumber = {$like: "%"+$scope.search.fieldnumber+"%"} ;
				} else {
					delete $scope.observationSearch.where.fieldnumber;
				}
				if ($scope.search.fromDate && $scope.search.toDate) {
					$scope.observationSearch.where.observationDate = {

						$between: [$filter('date')($scope.search.fromDate, "yyyy-MM-dd", '+0200'), $filter('date')($scope.search.toDate, "yyyy-MM-dd", '+0200')]
					}
				} else if ($scope.search.fromDate) {
					var formattedDate = $filter('date')($scope.search.fromDate, "yyyy-MM-dd", '+0200');
					$scope.observationSearch.where.observationDate = ($scope.search.exactDate) ? formattedDate : {
						$gte: formattedDate
						
					};
					
				} else if ($scope.search.toDate) {
					$scope.observationSearch.where.observationDate = {
						$lte:  $filter('date')($scope.search.toDate, "yyyy-MM-dd", '+0200')
					}
				}
				if ($scope.search.geometry) {
					$scope.observationSearch.geometry = $scope.search.geometry;
				} else {
					delete $scope.observationSearch.geometry;
				}

				if ($scope.search.activeThreadsOnly) {
					$scope.observationSearch.activeThreadsOnly = $scope.search.activeThreadsOnly;
				} else {
					delete $scope.observationSearch.activeThreadsOnly;
				}
				
				if($scope.search.selectedMonths.length > 0){
					$scope.observationSearch.selectedMonths = $scope.search.selectedMonths;
				} else {
					delete $scope.observationSearch.selectedMonths
				}

			}, true)
		}
	]);
