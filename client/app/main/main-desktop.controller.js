'use strict';

angular.module('svampeatlasApp')
	.controller('MainDesktopCtrl', function($scope, $http, $translate, $mdMedia, Observation, ObservationImage, Locality, appConstants, $mdDialog, leafletData, $timeout, ObservationModalService, ObservationFormService, $state, $stateParams, Auth, $location, preloader, SearchService, $q, User, Taxon, $rootScope) {

		//  $scope.isChrome = (/Chrome/i.test(navigator.userAgent));
		$scope.Auth = Auth;
		$scope.$state = $state;
		$scope.ObservationFormService = ObservationFormService;
		$scope.translate = $translate;
		$scope.useLichenFilter = Boolean(localStorage.getItem('use_lichen_filter'));
		$scope.useNoLichenFilter = Boolean(localStorage.getItem('use_no_lichen_filter'));

		$scope.ProbableDeterminationScore = appConstants.ProbableDeterminationScore;
		$scope.AcceptedDeterminationScore = appConstants.AcceptedDeterminationScore;
		SearchService.getMorphoGroup().then(function(morphoGroup) {
			$scope.morphoGroup = morphoGroup;

		})





		function loadCounts() {
			$scope.observationCount = 700000;
			$scope.imageCount = 140000;
			$scope.userCount = 2300;
			$scope.speciesCount = 7300;
			Observation.getCount({
				cached: true
			}).$promise.then(function(res) {
				$scope.observationCount = res[0].count;
			})

			ObservationImage.getCount({
				cached: true
			}).$promise.then(function(res) {
				$scope.imageCount = res[0].count;
			})
			User.getCount({
				cached: true
			}).$promise.then(function(res) {
				$scope.userCount = res[0].count;
			})

			Taxon.getNumberOfDanishSpecies({
				id: 'all',
				cached: true
			}).$promise.then(function(res) {
				$scope.speciesCount = res[0].count;
			})
		}

		loadCounts();
		$rootScope.$on("preferred_language_changed", function(newval) {
			loadCounts();
		})
		var frontPageImages = ['NetstokketIndigoroerhat.jpg', 'BomuldsSloerhat.jpg', 'koralpigsvamp.jpg', 'RoedFluesvamp.jpg', 'SejTraadkoelle.jpg']
		var randImg = frontPageImages[Math.floor(Math.random() * frontPageImages.length)];
		$scope.getHeaderImgBackgroundStyle = function(img) {


			//var randImg ='koralpigsvamp.jpg';
			var url = appConstants.baseurl + appConstants.thumborUrl + "1200x400/"

			+appConstants.baseurl + appConstants.imageurl + "mainpage/" + randImg;


			return {
				'background-image': 'url(' + url + ')',
				'background-size': 'cover'
			};
		}

		$scope.getBackgroundStyle = function(tile) {

			var url = appConstants.baseurl + appConstants.thumborUrl + "300x200/"

			+appConstants.baseurl + appConstants.imageurl + tile.Images[0].name + ".JPG";


			return {
				'background-image': 'url(' + url + ')',
				'background-size': 'cover'
			};


		}


		$scope.openMenu = function($mdOpenMenu, ev) {

			$mdOpenMenu(ev);
		};
		$scope.mdMedia = $mdMedia;
		$scope.ObservationModalService = ObservationModalService;




		$scope.mapsettings = {
			defaults: {
				attributionControl: false
			},
			center: {
				lat: 56,
				lng: 11,
				zoom: 6
			},
			markers: {

			},
			paths: {

			},
			layers: {
				baselayers: {
					osm: {
						name: 'OpenStreetMap',
						url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
						type: 'xyz'
					}
				}
			}
		};

		function getPath(obs) {

			var path = {

				latlngs: {
					lat: obs.decimalLatitude,
					lng: obs.decimalLongitude
				},
				type: "circleMarker",
				radius: 4,
				weight: 2,
				opacity: 1,

				fillOpacity: 0.8,
				name: obs._id,
				color: "#2196F3"

			};
			return path;
		}

		$scope.latestlocalitydays = 3;
		$scope.$on('leafletDirectivePath.frontpagemap.click', function(e, args) {

			$state.go('search-list', {
				locality_id: args.modelName,
				date: moment().subtract($scope.latestlocalitydays, 'days').toString()
			})
		})


		$scope.getLatestLocalities = function(days) {
			if (!days) {
				days = $scope.latestlocalitydays;
			} else {
				$scope.latestlocalitydays = days;
			}

			var locQuery = {
				days: days
			};
			if ($scope.useLichenFilter) {
				locQuery.lichensonly = true;
			} else if ($scope.useNoLichenFilter) {
				locQuery.omitlichens = true;
			}

			return Locality.recent(locQuery).$promise.then(function(localities) {

				$scope.mapsettings.paths = {};
				$scope.mapsettings.markers = {};
				for (var i = 0; i < localities.length; i++) {

					$scope.mapsettings.paths[localities[i]._id] = getPath(localities[i]);



				}

			}).then(function() {
				leafletData.getMap('frontpagemap').then(function(map) {
					map.zoomControl.setPosition('topright');

					$timeout(function() {
						map.invalidateSize();
					}, 11);
				});
			});
		}
		$scope.getLatestLocalities();




		$scope.getDate = function(observationDate, observationDateAccuracy) {

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



		var determinationwhere;

		if ($scope.useLichenFilter) {
			determinationwhere = {
				lichenized: 1,
				$or: [{
					Determination_validation: 'Godkendt'
				}, {
					Determination_score: {
						$gte: 80
					}
				}]
			}
		} else if ($scope.useNoLichenFilter) {
			determinationwhere = {
				lichenized: 0,
				Taxon_redlist_status: ['RE', 'CR', 'EN', 'VU', 'NT'],
				$or: [{
					Determination_validation: 'Godkendt'
				}, {
					Determination_score: {
						$gte: 80
					}
				}]
			}

		} else {
			determinationwhere = {
				Taxon_redlist_status: ['RE', 'CR', 'EN', 'VU', 'NT'],
				$or: [{
					Determination_validation: 'Godkendt'
				}, {
					Determination_score: {
						$gte: 80
					}
				}]
			};
		}


		var query = {
			nocount: true,
			_order: JSON.stringify([
				['observationDate', 'DESC'],
				['_id', 'DESC']
			]),
			limit: 24,

			include: JSON.stringify(
				[
					JSON.stringify({
						model: "DeterminationView",
						as: "DeterminationView",
						where: determinationwhere,
						required: true
					}),
					JSON.stringify({
						model: "ObservationImage",
						as: 'Images',
						required: true

					}),
					JSON.stringify({
						model: "User",
						as: 'PrimaryUser',
						attributes: ['_id', 'email', 'Initialer', 'name'],
						where: {},
						required: true
					}),
					JSON.stringify({
						model: "Locality",
						as: 'Locality',
						where: {},
						required: true
					}),
				]
			)

		};


		query.cachekey = ($scope.useLichenFilter) ? 'latestlichens' : 'latestredlisted';

		$q.all([Observation.getObservationsFlaggedForFrontpageAsNewDK().$promise, Observation.getObservationsFlaggedForFrontpage().$promise, Observation.query(query).$promise]).then(function(data) {
			var observations = data[2];
			var flaggedObservations = data[1];
			var newDkObservations = data[0];
			for (var i = 0; i < newDkObservations.length; i++) {
				newDkObservations[i].newDK = true;
			}
			var tileData = ($scope.useLichenFilter) ? observations : newDkObservations.concat(flaggedObservations.concat(observations));
			$scope.tiles = _.filter(tileData, function(u) {
				return u.Images.length > 0;
			});

			// preloader.preloadImages( $scope.tiles);
		})


		$http.jsonp('https://svampeatlasnyheder.blogspot.com/feeds/posts/default?alt=json-in-script&callback=JSON_CALLBACK')
			.success(function(data) {
				$scope.news = data.feed.entry;
			});




		$scope.showNews = function(ev, item) {
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

			$mdDialog.show({
				controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {
					$scope.item = item;
					$scope.cancel = function() {
						$mdDialog.cancel();
					};


				}],
				templateUrl: 'app/main/news.tpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: useFullScreen
			})


			$scope.$watch(function() {
				return $mdMedia('xs') || $mdMedia('sm');
			}, function(wantsFullScreen) {
				$scope.customFullscreen = (wantsFullScreen === true);
			});
		};


		$scope.$watch(function() {
			return $mdMedia('sm');
		}, function() {
			$scope.validationTileLimit = 2
		});

		$scope.$watch(function() {
			return $mdMedia('md');
		}, function() {
			$scope.validationTileLimit = 3
		});
		$scope.$watch(function() {
			return $mdMedia('gt-md');
		}, function() {
			$scope.validationTileLimit = 4
		});

		$scope.pageForward = function() {
			$scope.validationTileOffset = ($scope.validationTileOffset + $scope.validationTileLimit);

			var deepCopiedArraySlice = [];
			for (var i = ($scope.validationTileOffset + $scope.validationTileLimit); i < ($scope.validationTileOffset + $scope.validationTileLimit * 2); i++) {
				deepCopiedArraySlice.push($scope.validationNeededtiles[i])
			}
			// preloader.preloadImages(deepCopiedArraySlice);

		}

		$scope.pageBackward = function() {
			$scope.validationTileOffset = ($scope.validationTileOffset - $scope.validationTileLimit);
		}


		var morphoGroups_ = localStorage.getItem('frontpage_filter_morphogroups');
		$scope.selectedMorphoGroup = (morphoGroups_) ? JSON.parse(morphoGroups_) : [];

		$scope.$watchCollection('selectedMorphoGroup', function(newVal, oldVal) {


			localStorage.setItem('frontpage_filter_morphogroups', JSON.stringify($scope.selectedMorphoGroup));
			if (newVal && oldVal && newVal.length !== oldVal.length) {
				$scope.selectedMorphoGroupChanged = true;
			};
		});

		$scope.findMorphoGroup = function(searchText) {
			if (searchText === "*") {
				return $scope.morphoGroup;
			} else {
				return $scope.morphoGroup.filter(function(g) {
					return g.name_dk.indexOf(searchText) > -1;
				})
			}

		}


		$scope.loadValidationTiles = function() {
			$scope.validationNeededtiles;


			$scope.validationTilesLoading = true;

			var determinationwhere = {

				$and: [{
					Determination_validation: {
						$ne: 'Godkendt'
					}
				}, {
					Determination_validation: {
						$ne: 'Afvist'
					}
				}, {
					Determination_score: {
						$lt: 80
					}
				}]
			};

			if ($scope.useLichenFilter) {
				determinationwhere.$and.push({lichenized : 1});
			} else if ($scope.selectedMorphoGroup && $scope.selectedMorphoGroup.length > 0) {
				determinationwhere.Taxon_morphogroup_id = _.map($scope.selectedMorphoGroup, function(d) {
					return d._id;
				})
			};
			
			if ($scope.useNoLichenFilter) {
				determinationwhere.$and.push({lichenized : {$ne: 1}});
							}
			
			var q = {
				nocount: true,
				_order: JSON.stringify([
					['createdAt', 'DESC'],
					['_id', 'DESC']
				]),
				limit: 100,

				include: JSON.stringify(
					[
						JSON.stringify({
							model: "DeterminationView",
							as: "DeterminationView",
							where: determinationwhere,
							required: true
						}),
						JSON.stringify({
							model: "ObservationImage",
							as: 'Images',
							required: true

						}),
						JSON.stringify({
							model: "User",
							as: 'PrimaryUser',
							attributes: ['_id', 'email', 'Initialer', 'name'],
							where: {},
							required: true
						}),
						JSON.stringify({
							model: "Locality",
							as: 'Locality',
							where: {},
							required: false
						}),
					]
				)

			};

			$scope.validationTileOffset = 0;
			Observation.query(q).$promise.then(function(observations) {

				$scope.validationNeededtiles = observations;
				$scope.validationTilesLoading = false;
				var deepCopiedArraySlice = [];
				for (var i = $scope.validationTileOffset; i < ($scope.validationTileLimit * 2); i++) {
					deepCopiedArraySlice.push($scope.validationNeededtiles[i])
				}
				// preloader.preloadImages(deepCopiedArraySlice);

				$scope.selectedMorphoGroupChanged = false;
			})

		}

		if (Auth.isLoggedIn()) {

			$scope.loadValidationTiles();

		};

	})
	.filter('limitHtml', function() {
		return function(text, limit) {

			var changedString = String(text).replace(/<[^>]+>/gm, '');
			var length = changedString.length;

			return changedString.length > limit ? changedString.substr(0, limit - 1) + "..." : changedString;
		}
	});
