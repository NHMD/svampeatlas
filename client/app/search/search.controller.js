'use strict';

angular.module('svampeatlasApp')
	.controller('SearchCtrl', ['$scope', 'ObservationSearchService', 'SearchService', 'User', 'Taxon', 'TaxonDKnames', 'Locality', 'Substrate', 'VegetationType', 'PlantTaxon', 'leafletData', '$timeout', '$mdUtil', '$mdSidenav', '$mdMedia', '$state', 'Auth', '$translate', '$filter',
		function($scope, ObservationSearchService, SearchService, User, Taxon, TaxonDKnames, Locality, Substrate, VegetationType, PlantTaxon, leafletData, $timeout, $mdUtil, $mdSidenav, $mdMedia, $state, Auth, $translate, $filter) {
		
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
				
				
				if(ObservationSearchService.getSearch().wasInitiatedOutsideSearchForm)	{
					$scope.resetForm();
				}
				$scope.setDate = function(days, model){
					
					$scope.search[model] = moment().subtract(days, 'days').toDate() ;
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
						$scope.leafletPolygon = 	layer;
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
						delete $scope.search.include[0].where.Determination_validation ;
						delete $scope.search.fieldnumber;
						delete $scope.search.databasenumber
						delete $scope.search._id;
					
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
					attributes: ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName', 'Determination_user_id'],
					where: {}
				}, {
					model: "User",
					as: 'PrimaryUser',
					//	attributes: ['email', 'Initialer', 'name'],
					required: false,
					where: {}
				}, {
					model: "Locality",
					as: 'Locality',
					attributes: ['_id', 'name'],
					where: {},
					required: true
				}, {
					model: "GeoNames",
					as: 'GeoNames',
					where: {},
					required: false
				}, {
					model: "ObservationUser",
					as: 'userIds',
					where: {},
					required: false
				}, {
					model: "ObservationImage",
					as: 'Images',
					where: {}
				}, {
					model: "ObservationForum",
					as: 'Forum',
					where: {}

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
			$scope.search.collectors = $scope.search.collectors || [];
			$scope.search.determiner = $scope.search.determiner || [];
			$scope.search.PrimaryUser = $scope.search.PrimaryUser || [];

			$scope.querySearchPlantTaxon = SearchService.querySearchPlantTaxon;


			$scope.setFromYear = function(year) {
				$scope.search.fromDate = new Date(year, 0, 1);
			}

			$scope.setToYear = function(year) {
				$scope.search.toDate = new Date(year, 11, 31);
			}
			$scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			$scope.search.selectedMonths = $scope.search.selectedMonths || [];
			$scope.toggle = function(item, list) {
				var idx = list.indexOf(item);
				if (idx > -1) {
					list.splice(idx, 1);
				} else {
					list.push(item);
				}
			};
			$scope.exists = function(item, list) {
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

				if ($scope.search.selectedVegetationType) {
					$scope.observationSearch.where.vegetationtype_id = $scope.search.selectedVegetationType;
				} else {
					delete $scope.observationSearch.where.vegetationtype_id;
				}

				if ($scope.search.selectedSubstrate) {
					$scope.observationSearch.where.substrate_id = $scope.search.selectedSubstrate;
				} else {
					delete $scope.observationSearch.where.substrate_id;
				}






				if ($scope.search.onlyForeign) {
					$scope.search.include[2].required = false;
					$scope.observationSearch.where.locality_id = {
						$eq: null
					};
				} else {
					delete $scope.observationSearch.where.locality_id;
					$scope.search.include[2].required = ($scope.search.geometry) ? false : !$scope.search.includeForeign;
				}



				if ($scope.search.selectedHigherTaxa.length > 0) {
					$scope.search.include[0].where.$or = _.map($scope.search.selectedHigherTaxa, function(tx) {

						// its a taxon resource
						var path = (tx.acceptedTaxon === null) ? tx.Path : tx.acceptedTaxon.Path;
						return {
							Taxon_path: {
								like: path + "%"
							}
						}

					})
				} else {
					delete $scope.search.include[0].where.$or;
				}


				if ($scope.search.selectedLocalities.length > 0) {
					$scope.search.include[2].where.$or = _.map($scope.search.selectedLocalities, function(loc) {
						return (loc.name) ? {
							name: {
								like: loc.name + "%"
							}
						} : {
							name: {
								like: loc + "%"
							}
						}
					})
				} else {
					delete $scope.search.include[2].where.$or;
				}

				/*
				if ($scope.search.PrimaryUser.length > 0) {
					$scope.observationSearch.where.primaryuser_id = { $in: _.map($scope.search.PrimaryUser, function(u){ return u._id})} 
				} else {
					delete $scope.observationSearch.where.primaryuser_id;
				
				}
				*/

				if ($scope.search.PrimaryUser.length > 0) {

					$scope.search.include[1].where = {
						_id: {
							$in: _.map($scope.search.PrimaryUser, function(u) {
								return u._id
							})
						} //$scope.search.PrimaryUser[0]._id
					}
					$scope.search.include[1].required = true;

				} else {

					$scope.search.include[1].where = {}
					$scope.search.include[1].required = false;
				}


				if ($scope.search.collectors.length > 0) {
					if ($scope.search.collectors[0]._id !== undefined) {
						$scope.search.include[4].where = {
							user_id: {
								$in: _.map($scope.search.collectors, function(u) {
									return u._id
								})
							} //$scope.search.collectors[0]._id
						}

						$scope.search.include[4].required = true;
					} else {
						$scope.observationSearch.where.verbatimLeg = {
							like: $scope.search.collectors[0] + "%"
						}
					}

				} else {
					$scope.search.include[4].where = {};
					$scope.search.include[4].required = false;
					delete $scope.observationSearch.where.verbatimLeg;
				}


				if ($scope.search.determiner.length > 0) {

					$scope.search.include[0].where.Determination_user_id = {
							$in: _.map($scope.search.determiner, function(u) {
								return u._id
							})
						} //$scope.search.determiner[0]._id


				} else {
					delete $scope.search.include[0].where.Determination_user_id;

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




				$scope.observationSearch.include = $scope.search.include;


				if ($scope.search.associatedOrganism.length > 0) {
					$scope.observationSearch.where.primaryassociatedorganism_id = {
						$in: _.map($scope.search.associatedOrganism, function(org) {
							return org._id
						})
					}


				} else {
					delete $scope.observationSearch.where.primaryassociatedorganism_id;
				}

				if ($scope.search.forumMaxAge !== undefined) {
					$scope.search.onlyWithForum = true;
					var formattedDate = $filter('date')($scope.search.forumMaxAge, "yyyy-MM-dd", '+0200');
					$scope.observationSearch.include[6].where.createdAt = {
							$gte: formattedDate
						}
					

				} else {
					delete $scope.observationSearch.include[6].where.createdAt;
				}
				
				if($scope.search.forumComment){
					$scope.observationSearch.include[6].where.content = {like: "%"+$scope.search.forumComment+"%"}
					$scope.search.onlyWithForum = true;
				} else {
					delete $scope.observationSearch.include[6].where.content;
				}
				
				

				if ($scope.search.onlyWithForum) {
					$scope.observationSearch.include[6].required = true;
				} else {
					$scope.observationSearch.include[6].required = false;
				}

				if ($scope.search.imageMaxAge !== undefined) {
					$scope.search.onlyWithImages = true;
					var formattedDate = $filter('date')($scope.search.imageMaxAge, "yyyy-MM-dd", '+0200');
					$scope.observationSearch.include[5].where.createdAt = {
							$gte: formattedDate
						}
					

				} else {
					delete $scope.observationSearch.include[5].where.createdAt;
				}

				if ($scope.search.onlyWithImages) {
					$scope.observationSearch.include[5].required = true;
				} else {
					$scope.observationSearch.include[5].required = false;
				}

				if ($scope.search.onlyMyObservations) {
					$scope.observationSearch.where.primaryuser_id = Auth.getCurrentUser()._id
				}

				if ($scope.search.notMyObservations) {
					$scope.observationSearch.where.primaryuser_id = {
						$ne: Auth.getCurrentUser()._id
					}
				}
				if (!$scope.search.onlyMyObservations && !$scope.search.notMyObservations) {
					delete $scope.observationSearch.where.primaryuser_id;
				}

				if ($scope.search.databasenumber) {
					$scope.observationSearch.where._id = $scope.search.databasenumber.split("-")[1] || $scope.search.databasenumber;
					$scope.observationSearch.include[2].required = false;
					delete $scope.observationSearch.include[0].where.Determination_validation;

				} else {
					delete $scope.observationSearch.where._id;
					$scope.observationSearch.include[0].where.Determination_validation = $scope.search.include[0].where.Determination_validation;
				}
				if ($scope.search.fieldnumber) {
					$scope.observationSearch.where.fieldnumber = {
						$like: "%" + $scope.search.fieldnumber + "%"
					};
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
						$lte: $filter('date')($scope.search.toDate, "yyyy-MM-dd", '+0200')
					}
				}
				
				if ($scope.search.addedFromDate && $scope.search.addedToDate) {
					$scope.observationSearch.where.createdAt = {

						$between: [$filter('date')($scope.search.addedFromDate, "yyyy-MM-dd", '+0200'), $filter('date')($scope.search.addedToDate, "yyyy-MM-dd", '+0200')]
					}
				} else if ($scope.search.addedFromDate) {
					var formattedDate = $filter('date')($scope.search.addedFromDate, "yyyy-MM-dd", '+0200');
					$scope.observationSearch.where.createdAt = ($scope.search.addedExactDate) ? formattedDate : {
						$gte: formattedDate

					};

				} else if ($scope.search.addedToDate) {
					$scope.observationSearch.where.createdAt = {
						$lte: $filter('date')($scope.search.addedToDate, "yyyy-MM-dd", '+0200')
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

				if ($scope.search.selectedMonths.length > 0) {
					$scope.observationSearch.selectedMonths = $scope.search.selectedMonths;
				} else {
					delete $scope.observationSearch.selectedMonths
				}

			}, true)
		}
	]);
