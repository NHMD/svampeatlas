'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonCtrl', ['$scope', 'Taxon', '$stateParams', '$timeout',
		function($scope, Taxon, $stateParams,$timeout) {
			
			$scope.$timeout = $timeout;
 
			
			if ($stateParams.id) {
				console.log("Found id " + $stateParams.id)
				$scope.taxon = Taxon.get({
					id: $stateParams.id
				});
				console.log($scope.taxon)
				
				$scope.taxon.$promise.then(function(){
					$scope.$watch('taxon.images', function(newVal, oldVal) {
					    if(newVal !== undefined && newVal !== oldVal) {
							$scope.currentImage = $scope.getCurrentImage();
					    }
					  }, true);
					  
					 
	
				})
				
				
			}

			$scope.getCurrentImage = function(){
				return _.find($scope.taxon.images, function(img) {
														return img.active === true;
															});
			}

			$scope.isValidYear = function(year) {
				var yearPattern = /^(19|20)\d{2}$/

				if (!yearPattern.test(year) || (parseInt(year) > new Date().getFullYear())) {
					return "You must enter a valid year";
				}
			}
			
			$scope.deleteImage = function(){
				
			return	Taxon.deleteImage({
									id: $scope.taxon._id,
									imgid: $scope.currentImage._id
								}).$promise.then(function(){
									_.remove($scope.taxon.images, function(img) {
									  return img._id = $scope.currentImage._id;
									});
									
								});
			};
			
			$scope.newPhoto = function(){
				$scope.currentImage = {}
				$scope.imageForm.$show();
			}
			
			$scope.editImage = function(){		
				$scope.currentImage = $scope.getCurrentImage();
				$timeout(function(){
					$scope.imageForm.$show();
				}, 0)	
				
			}
			
			$scope.saveOrUpdateImage = function(){	
				if(!$scope.imageForm.$dirty)	{
					return;
				}
				else if($scope.currentImage._id !== undefined && $scope.isValidImage($scope.currentImage)){
							   
					Taxon.updateImage({
										id: $scope.taxon._id,
										imgid: $scope.currentImage._id
									}, $scope.currentImage);
				} else if($scope.isValidImage($scope.currentImage)) {
					Taxon.addImage({
						id: $scope.taxon._id
					}, _.merge($scope.currentImage, {taxon_id: $scope.taxon._id}) ).$promise.then(function(image){
						
						$scope.taxon.images.push(image);
					})
				} 	
				
			}
			
			$scope.isValidImage = function(img){
				return img.uri !== undefined && img.thumburi !== undefined
			}
		}
	])
	.filter('synonymsWithoutSelf', function() {
		return function(synonyms) {
			return _.filter(synonyms, function(s) {
				return s.accepted_id !== s._id;;
			});

		};
	});
