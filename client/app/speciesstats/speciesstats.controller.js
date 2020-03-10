'use strict';

angular.module('svampeatlasApp')
	.controller('SpeciesStatsCtrl', function($scope, $translate, $mdMedia, Taxon, Observation, Locality, appConstants, leafletData, $timeout, ObservationModalService, ObservationSearchService, $state, $stateParams, ObservationCountService, MapBox, KMS) {

		var capitalizeFirstLetter = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		$scope.capitalizeFirstLetter = capitalizeFirstLetter;

		$scope.$state = $state;
		$scope.baseUrl = appConstants.baseurl;

		$scope.ObservationModalService = ObservationModalService;

		$scope.timeinterval = "all"
		$scope.mapsettings = {
			defaults: {
				attributionControl: false,
				layersControl: false
			},
			center: {
				lat: 56,
				lng: 11,
				zoom: 6
			},
			paths: {

			},
			events: {
				path: {
					enable: ['click']
				}
			},
			layers: {
				baselayers: {
					osm: {
						name: 'OpenStreetMap',
						url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
						type: 'xyz'
					}
				},
				overlays: {
					2009: {
						name: $translate.use() === 'en' ? 'After 2008' : 'Efter 2008',
						visible: true,
						type: 'featureGroup'

					},
					2008: {
						name: '1991-2008',
						visible: true,
						type: 'featureGroup'

					},
					1991: {
						name: $translate.use() === 'en' ? 'Before 1991' : 'Før 1991',
						visible: true,
						type: 'featureGroup'
					}


				}
			}
		};
		
		MapBox.getTicket().then(function(ticket) {

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

		KMS.getTicket().then(function(ticket) {

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

		function getPath(obs) {

			var path = {

				latlngs: {
					lat: obs.decimalLatitude,
					lng: obs.decimalLongitude
				},
				type: "circleMarker",
				radius: 3,
				weight: 2,
				opacity: 1,

				fillOpacity: 0.8,

				name: obs._id,


			};
			var y = obs.observationDate.split("-")[0];
			if (y < 1991) {

				path.layer = '1991';
				path.color = "#FFEB3B";
				return path;
			} else if (y > 1990 && y < 2009) {

				path.layer = '2008';
				path.color = "#FF9800";
				return path;
			} else {

				path.layer = '2009';
				path.color = "#2196F3";

				return path;
			}
		}

		function showAllLayers(show) {
			$scope.mapsettings.layers.overlays['1991'].visible = show;
			$scope.mapsettings.layers.overlays['2008'].visible = show;
			$scope.mapsettings.layers.overlays['2009'].visible = show;
			/*if(show)
			{ leafletData.getMap("speciesmap").then(function(map){
					
					leafletData.getLayers().then(function(layers) {
						
						layers.overlays['2009'].bringToFront();
						
					
						
						
					});
				
			})
		
		}*/
		}
		$scope.$on('leafletDirectivePath.speciesmap.click', function(event, args) {
			ObservationModalService.show(event, {
				_id: args.modelName
			})
		});

		$scope.updateMap = function(timeinterval) {

			switch (timeinterval) {
				case '1991':
					showAllLayers(false),
						$scope.mapsettings.layers.overlays['1991'].visible = true;

					break;
				case '2008':
					showAllLayers(false);
					$scope.mapsettings.layers.overlays['2008'].visible = true;

					break;
				case '2009':
					showAllLayers(false);
					$scope.mapsettings.layers.overlays['2009'].visible = true;
					break;
				case 'all':
					showAllLayers(false);
					showAllLayers(true);
					break;
				default:
					showAllLayers(false);
					showAllLayers(true);

			}

		}


		var chartWidth = $mdMedia('gt-xs') ? 400 : 300


		$scope.monthChartOptions = {
			options: {
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'column',
					height: 300,
					width: chartWidth,
				},
				title: {
					text: $translate.use() === 'en' ? "Distribution of records by month" : "Fundfordeling over måneder"
				},

				xAxis: {
					type: 'category',
					labels: {
						rotation: -45,
						style: {
							fontSize: '13px',
							fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
						}
					}
				},
				yAxis: {
					min: 0,
					title: {
						text: $translate.use() === 'en' ? "Number of records" : "Antal fund",
					}
				},
				legend: {
					enabled: false
				}
			}

		}

		var hostChartOpts = angular.copy($scope.monthChartOptions);
		hostChartOpts.options.title.text = $translate.use() === 'en' ? "Distribution by 10 most frequent hosts" : "Fordeling på de 10 hyppigste værter";
		$scope.hostChartOptions = hostChartOpts;

		var decadeChartOpts = angular.copy($scope.monthChartOptions);
		decadeChartOpts.options.title.text = $translate.use() === 'en' ? "Distribution by decade" : "Fordeling af fund over 10 års perioder";
		decadeChartOpts.options.tooltip = {
			pointFormat: '{series.name}: <b>{point.y:.1f}</b>'
		};
		decadeChartOpts.options.yAxis.title.text = $translate.use() === 'en' ? "Number of records pr 100.000" : 'Antal fund pr 100.000';
		$scope.decadeChartOptions = decadeChartOpts;

		$scope.months = $translate.use() !== 'en' ? _.map(['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'], function(m) {
			return [capitalizeFirstLetter(m), 0];
		}) : _.map(['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'oktober', 'november', 'december'], function(m) {
			return [capitalizeFirstLetter(m), 0];
		})
		$scope.hosts = [];
		$scope.decades = [];
		$scope.decadesWeighted = [];
		var search = ObservationSearchService.getNewSearch();
	
		$scope.taxon = Taxon.getAcceptedTaxon({
			id: $stateParams.id || 10000
		});
		
		
		$scope.taxon.$promise.then(function(){
			
			search.include[0].where = {
				Taxon_Path: {like: $scope.taxon.Path+"%"},
				$or: {
					Determination_validation: 'Godkendt',
					Determination_score: {$gte: appConstants.AcceptedDeterminationScore}	
				}
				
			};
			
			search.include[2].required = true;

			search.include.splice(3, 4);
			search.include.push({
				model: "PlantTaxon",
				as: "PrimaryAssociatedOrganism"
			})
			var queryinclude = _.map(_.filter(search.include, function(e) {
				return e.model !== 'GeoNames'
			}), function(n) {
				return JSON.stringify(n);
			});


			Observation.query({
				where: {},
				include: JSON.stringify(queryinclude)
			}, function(result, headers) {

				$scope.observations = result;
				$scope.$parent.count = headers('count');
				$scope.mapsettings.paths = {};
				var hostsMap = {};
				var decadesMap = {};
				for (var i = 0; i < result.length; i++) {
					$scope.mapsettings.paths[result[i]._id] = getPath(result[i]);

					var mth = parseInt(result[i].observationDate.split("-")[1], 10);

					if (mth > 0) {
						$scope.months[mth - 1][1]++;
					}

					if (result[i].PrimaryAssociatedOrganism) {
						if (hostsMap[result[i].PrimaryAssociatedOrganism.DKandLatinName]) {
							hostsMap[result[i].PrimaryAssociatedOrganism.DKandLatinName]++;
						} else {
							hostsMap[result[i].PrimaryAssociatedOrganism.DKandLatinName] = 1;
						}
					};

					var dec = (Math.floor(result[i].observationDate.split("-")[0] / 10)) * 10;
					if (dec > 0) {
						if (decadesMap[dec]) {
							decadesMap[dec]++;
						} else {
							decadesMap[dec] = 1;
						}
					}

				};
	
				/*
				for (var key in decadesMap){
					if (decadesMap.hasOwnProperty(key)) {
					$scope.decades.push([key+"-"+(parseInt(key)+9), decadesMap[key]]);
				}
				};
				 */
				ObservationCountService.getCount().then(function(globalDecades) {
					for (var i = 0; i < globalDecades.length; i++) {
						if (decadesMap.hasOwnProperty(globalDecades[i].decade)) {
							$scope.decadesWeighted.push([globalDecades[i].decade.toString() + "-" + (globalDecades[i].decade + 9).toString(), (parseInt(decadesMap[globalDecades[i].decade]) / parseInt(globalDecades[i].count)) * 100000])
						}

					}
				})

				for (var key in hostsMap) {
					if (hostsMap.hasOwnProperty(key)) {
						$scope.hosts.push([key, hostsMap[key]]);
					}
				};

				$scope.hosts.sort(function(a, b) {
						return b[1] - a[1];
					})
					/*
					$scope.decades.sort(function(a, b){
						return  b[0] - a[0];
					}) */
				$scope.hosts = $scope.hosts.slice(0, 10);
				//$scope.decades = $scope.decades.slice(0, 11);
				$scope.monthChartOptions.series = [{
					name: $translate.use() === 'en' ? "Number of records" : "Antal fund",
					data: $scope.months
				}];
				$scope.hostChartOptions.series = [{
					name: $translate.use() === 'en' ? "Number of records" : "Antal fund",
					data: $scope.hosts
				}];

				$scope.decadeChartOptions.series = [{
					name: $translate.use() === 'en' ? "Number of records pr 100.000" : "Antal fund pr 100.000",
					data: $scope.decadesWeighted
				}];


			})
		})
		
		


	})
