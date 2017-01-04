'use strict';

angular.module('svampeatlasApp')
	.controller('SpeciesCtrl', function($scope, $translate, $mdMedia, Taxon, Observation, Locality, appConstants, leafletData, $timeout, ObservationModalService, ObservationSearchService, $state, $stateParams, ObservationCountService, $mdDialog, SimilarTaxa, SimilarTaxaModalService, Auth, preloader) {

		//  $scope.isChrome = (/Chrome/i.test(navigator.userAgent));
		$scope.Auth = Auth;
		$scope.SimilarTaxaModalService = SimilarTaxaModalService;
		$scope.$state = $state;
		$scope.baseUrl = appConstants.baseurl;
		$scope.isModal = $stateParams.isModal;
		$scope.cancel = function(){
			$mdDialog.cancel()
		}

		$scope.ObservationModalService = ObservationModalService;
		
		$scope.getBackgroundStyle = function(tile){
			
			var url = appConstants.imageurl + tile.Images[0].name + ".JPG";
			
	  
			
		    return {'background-image':  'url('+url+')', 'background-size': 'cover'};
		}
		
		
		var capitalizeFirstLetter = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		$scope.capitalizeFirstLetter = capitalizeFirstLetter;
		$scope.lowerCaseFirstLetter = function(string) {
			return string.charAt(0).toLowerCase() + string.slice(1);
		}


		$scope.showRecords = function(resulttype) {
			$state.go('search-' + resulttype, {
				taxon_id: $stateParams.id || 10000
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
			id: $stateParams.id || 10000
		})



		$scope.taxon.$promise.then(function() {

			$scope.higherTaxa = Taxon.higherTaxa({
				id: $scope.taxon._id
			});
			
			SimilarTaxa.query({where: {$or: [{taxon1_id: $scope.taxon._id}, {taxon2_id: $scope.taxon._id}]}}).$promise.then(function(similarTaxa){
				$scope.taxon.similarTaxa = similarTaxa;
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
		
		$scope.tiles = [];
		
		$scope.loadTiles = function(offset, limit) {

			
			$scope.tileLimit = limit;

			 Observation.query({
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
				
				preloader.preloadImages(result).then(
					function(missingImages){
						$scope.isLoading = false;
						// returns an array of _id´s of failed images. May ne posted to server to flag missing images
					}
				)
				$scope.tileCount = headers('count');
				$scope.tileOffset = $scope.tileOffset + $scope.tileLimit;
				$scope.tiles = $scope.tiles.concat(result);
			})

		}



	
		$scope.getImageUrl = function(tile) {

			return appConstants.imageurl + tile.Images[0].name + ".JPG";
		}




	})
