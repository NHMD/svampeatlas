'use strict';

angular.module('svampeatlasApp')
	.controller('ImageFormCtrl', ['$scope', '$timeout', 'Taxon', '$state',
		function($scope, $timeout, Taxon, $state) {
			$scope._ = _;
			
			/*       START OF IMAGE FORM HANDLING*/
			$scope.deleteImage = function() {

				return Taxon.deleteImage({
					id: $scope.taxon._id,
					imgid: $scope.currentImage._id
				}).$promise.then(function() {

					$state.go($state.$current, null, {
						reload: true
					});


				});
			};


			$scope.newPhoto = function() {
				$scope.currentImage = {}
				$scope.imageForm.$show();
			}

			$scope.editImage = function() {

				$timeout(function() {
					$scope.imageForm.$show();
				}, 0)

			}

			$scope.saveOrUpdateImage = function() {
				if (!$scope.imageForm.$dirty) {
					return;
				} else if ($scope.currentImage._id !== undefined && $scope.isValidImage($scope.currentImage)) {

					Taxon.updateImage({
						id: $scope.taxon._id,
						imgid: $scope.currentImage._id
					}, $scope.currentImage);
				} else if ($scope.isValidImage($scope.currentImage)) {
					Taxon.addImage({
						id: $scope.taxon._id
					}, _.merge($scope.currentImage, {
						taxon_id: $scope.taxon._id
					})).$promise.then(function(image) {


						$state.go($state.$current, null, {
							reload: true
						});


					})
				}

			}
			$scope.onSlideChanged = function(nextSlide, direction, nextIndex) {

				$scope.currentImage = $scope.taxon.images[nextIndex];

			}

			$scope.isValidImage = function(img) {
				return img.uri !== undefined && img.thumburi !== undefined
			};

			/*       END OF IMAGE FORM HANDLING*/

			
		}
	]);
