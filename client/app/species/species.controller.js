'use strict';

angular.module('svampeatlasApp')
	.controller('SpeciesCtrl', function($scope, $translate, $mdMedia, Taxon, Observation, Locality, appConstants, leafletData, $timeout, ObservationModalService, ObservationSearchService, $state, $stateParams, ObservationCountService) {

		//  $scope.isChrome = (/Chrome/i.test(navigator.userAgent));

		$scope.$state = $state;
		$scope.baseUrl = appConstants.baseurl;

		$scope.ObservationModalService = ObservationModalService;

		var capitalizeFirstLetter = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		$scope.capitalizeFirstLetter = capitalizeFirstLetter;
		$scope.lowerCaseFirstLetter = function(string) {
			return string.charAt(0).toLowerCase() + string.slice(1);
		}


		$scope.showRecords = function(resulttype) {
			$state.go('search-' + resulttype, {
				taxon_id: $stateParams.id
			})
		}



			/*
			for (var key in decadesMap){
				if (decadesMap.hasOwnProperty(key)) {
				$scope.decades.push([key+"-"+(parseInt(key)+9), decadesMap[key]]);
			}
			};
			 */


		$scope.taxon = Taxon.getAcceptedTaxon({
			id: $stateParams.id
		})



		$scope.taxon.$promise.then(function() {
			if ($scope.taxon.Vernacularname_DK) {
				$scope.vernacularname_dk = capitalizeFirstLetter($scope.taxon.Vernacularname_DK.vernacularname_dk)
			}
			$scope.higherTaxa = Taxon.higherTaxa({
				id: $scope.taxon._id
			})
		})


		$scope.tileOffset = 0;
		$scope.tileLimit = 24;
		$scope.tileCount = 0;

		$scope.taxon.$promise.then(function() {

			_.each($scope.taxon.synonyms, function(s) {
				if (s._id !== s.accepted_id) {
					$scope.taxon.images = $scope.taxon.images.concat(s.images)
				}
			});
			$scope.loadTiles($scope.tileOffset, $scope.tileLimit);
		})

		$scope.loadTiles = function(offset, limit) {

			$scope.tileOffset = offset;
			$scope.tileLimit = limit;

			$scope.tiles = Observation.query({
				offset: $scope.tileOffset,
				order: 'observationDate DESC',
				limit: $scope.tileLimit,


				include: JSON.stringify(
					[
						JSON.stringify({
							model: "DeterminationView",
							as: "DeterminationView",
							where: {
								Taxon_id: $scope.taxon.accepted_id,
								Determination_validation: 'Godkendt'
							}
						}),
						JSON.stringify({
							model: "ObservationImage",
							as: 'Images',
							required: true,
							where: {
								hide: 0
							}

						}),
						JSON.stringify({
							model: "User",
							as: 'PrimaryUser',
							attributes: ['_id', 'email', 'Initialer', 'name'],
							where: {}
						}),
						JSON.stringify({
							model: "Locality",
							as: 'Locality',
							where: {}
						}),
					]
				)

			}, function(result, headers) {
				$scope.tileCount = headers('count');
			})

		}



		$scope.loaded = {};
		$scope.failed = {};
		$scope.imageHasLoaded = function(img) {
			$scope.loaded[img] = true;

		};
		$scope.imageHasFailed = function(img) {
			$scope.failed[img] = true;

		};
		$scope.getImageUrl = function(tile) {

			return appConstants.imageurl + tile.Images[0].name + ".JPG";
		}




	})
