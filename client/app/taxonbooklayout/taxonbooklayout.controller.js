'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonBookLayoutCtrl', ['$q','$scope', 'Taxon', 'TaxonIntegrationService', 'TaxonTypeaheadService', 'TaxonAttributes','NatureTypes', 'NutritionStrategies','$state' ,'$stateParams', '$timeout', '$modal',
		function($q, $scope, Taxon, TaxonIntegrationService, TaxonTypeaheadService,TaxonAttributes, NatureTypes,NutritionStrategies, $state, $stateParams, $timeout, $modal) {
			
			$scope.Taxon = Taxon;
			$scope.natureTypes = NatureTypes.query();
			$scope.nutritionStrategies = NutritionStrategies.query();
			$scope.basicNutritionLimit = 2;
			$scope.biotrofNutrionLimit = 10;
			$scope.$timeout = $timeout;

 if ($stateParams.id && $stateParams.id !== 'new') {
				console.log("Found id " + $stateParams.id)
				$scope.taxon = Taxon.get({
					id: $stateParams.id
				});
				$scope.taxonAttributes	= TaxonAttributes.get({
					id: $stateParams.id
				});
				console.log($scope.taxon);
				
				
					


				$scope.taxon.$promise.then(function() {
					$scope.$watch('taxon.images', function(newVal, oldVal) {
						if (newVal !== undefined && newVal !== oldVal) {
							$scope.currentImage = $scope.getCurrentImage();
						}
					}, true);

				})
				
				$q.all([$scope.taxon.$promise, $scope.natureTypes.$promise]).then(function(){
					
					for(var i=0; i< $scope.taxon.naturtyper.length; i++ ) {
				
					    _.find($scope.natureTypes, function(nt) {
					    				   return nt._id === $scope.taxon.naturtyper[i]._id;
					   			   }).isChecked = true;
					}

				});
				
				$q.all([$scope.taxon.$promise, $scope.nutritionStrategies.$promise]).then(function(){
					
					for(var i=0; i< $scope.taxon.nutritionstrategies.length; i++ ) {
						if($scope.taxon.nutritionstrategies[i]._id === 1){
							$scope.taxon.isBiotroph = true;
						}
					    _.find($scope.nutritionStrategies, function(nt) {
					    				   return nt._id === $scope.taxon.nutritionstrategies[i]._id;
					   			   }).isChecked = true;
					}

				});

				
			};

			$scope.TaxonTypeaheadService = TaxonTypeaheadService;
			
		

			$scope.getCurrentImage = function() {
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

			$scope.deleteImage = function() {

				return Taxon.deleteImage({
					id: $scope.taxon._id,
					imgid: $scope.currentImage._id
				}).$promise.then(function() {
					_.remove($scope.taxon.images, function(img) {
						return img._id = $scope.currentImage._id;
					});

				});
			};

			$scope.newPhoto = function() {
				$scope.currentImage = {}
				$scope.imageForm.$show();
			}

			$scope.editImage = function() {
				$scope.currentImage = $scope.getCurrentImage();
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

						$scope.taxon.images.push(image);
					})
				}

			}

			$scope.isValidImage = function(img) {
				return img.uri !== undefined && img.thumburi !== undefined
			};
			

/*
			
			$scope.parentModal = $modal({
				scope: $scope,
				template: '/app/taxon/parent.modal.tpl.html',
				show: false
			});
			$scope.rankModal = $modal({
				scope: $scope,
				template: '/app/taxon/rank.modal.tpl.html',
				show: false
			});
			
			$scope.synonymModal = $modal({
				scope: $scope,
				template: '/app/taxon/synonym.modal.tpl.html',
				show: false
			});
			
			*/
			$scope.taxonHasNatureType = function(natureTypeId){
				
				return _.find($scope.taxon.naturtyper, function(nt) {
 				   return nt._id === natureTypeId;
			   }) ;
			};
			
			
			$scope.addOrRemoveNatureType = function(type){
				
				if(type.isChecked && !$scope.taxonHasNatureType(type._id)){
					// create the type
					Taxon.addNatureType({
					id: $scope.taxon._id
				}, type).$promise.then(function(){
					$scope.taxon.naturtyper.push(type)
				}).catch(function(err){
					type.isChecked = !type.isChecked
				})
				}
				else if(!type.isChecked && $scope.taxonHasNatureType(type._id)){
					// delete the type
					Taxon.deleteNatureType({
					id: $scope.taxon._id,
						naturetypeid: 	type._id
				}).$promise.then(function(){
					_.remove($scope.taxon.naturtyper, function(t) {
					  return t._id == type._id;
					});
				}).catch(function(err){
					type.isChecked = !type.isChecked
				})
					
				}
				
			};
			
			$scope.taxonHasNutritionStrategy = function(nutritionStrategyId){
				
				return( _.find($scope.taxon.nutritionstrategies, function(nt) {
 				   return nt._id === nutritionStrategyId;
			   })) ? true : false ;
			};
			
			$scope.addOrRemoveNutritionStrategy = function(type){
				
				if(type.isChecked && !$scope.taxonHasNutritionStrategy(type._id)){
					// create the type
					Taxon.addNutritionStrategy({
					id: $scope.taxon._id
				}, type).$promise.then(function(){
					
					$scope.taxon.nutritionstrategies.push(type)
					if(type._id === 1){
						$scope.taxon.isBiotroph = $scope.taxonHasNutritionStrategy(type._id);
						console.log($scope.taxon.isBiotroph)
					}
				}).catch(function(err){
					
					type.isChecked = $scope.taxonHasNutritionStrategy(type._id);
				})
				}
				else if(!type.isChecked && $scope.taxonHasNutritionStrategy(type._id)){
					// delete the type
					Taxon.deleteNutritionStrategy({
					id: $scope.taxon._id,
						nutritionstrategyid: 	type._id
				}).$promise.then(function(){
					
					_.remove($scope.taxon.nutritionstrategies, function(t) {
					  return t._id == type._id;
					});
					if(type._id === 1){
						$scope.taxon.isBiotroph = $scope.taxonHasNutritionStrategy(type._id);
						console.log($scope.taxon.isBiotroph)
					}
				}).catch(function(err){
					
					type.isChecked = $scope.taxonHasNutritionStrategy(type._id);
					
				})
					
				}
				
				
				
				
			};

		/*	$scope.ranktabs = [
			    { title:'Change parent',  active: true},
			    { title:'Choose new rank'   },
				{ title:'Taxon'  },
				{ title:'Log'}
			  ];
			
			  
			
			$scope.selectRankTab = function(tab){
				
				
				
			}
			*/
		}
	]);
