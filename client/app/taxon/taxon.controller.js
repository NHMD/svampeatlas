'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonCtrl', ['$scope', 'Taxon', 'TaxonIntegrationService', '$state' ,'$stateParams', '$timeout', '$modal',
		function($scope, Taxon, TaxonIntegrationService, $state, $stateParams, $timeout, $modal) {
			
			$scope.changeRankAndSave = function(taxon){
				
				taxon.RankName = $scope.superrank;
				taxon.RankID = $scope.selectedSuperRankID.superrankId;
				taxon.FunIndexNumber = 0;
				taxon.FunIndexCurrUseNumber =0;
				taxon.FunIndexTypificationNumber = 0;
				taxon.GUID = "";
				if($scope.superrank === "superspecies"){
					taxon.FullName = taxon.Parent.TaxonName + " "+ taxon.TaxonName ;
				};
				if($scope.superrank === "supergenus"){
					taxon.FullName = taxon.TaxonName ;
				};
				
				//$scope.selectedSuperRankID = undefined;
				
				taxon.$update().then(function(t){
					$scope.taxon = t;
					//$state.go('taxon', {id: taxon._id}, {inherit: false, notify: false});
					$scope.rankModal.hide();
				})
				
			};
			
			
			
			$scope.$timeout = $timeout;

			if ($stateParams.id && $stateParams.id === 'new') {
				$scope.taxon = {};
				if (TaxonIntegrationService.taxon) {
					TaxonIntegrationService.taxon.then(function(taxon) {
						$scope.taxon = new Taxon(taxon);
						$scope.taxon.PresentInDK = false;
						console.log($scope.taxon)
					})

				}
			} else if ($stateParams.id && $stateParams.id !== 'new') {
				console.log("Found id " + $stateParams.id)
				$scope.taxon = Taxon.get({
					id: $stateParams.id
				});
				console.log($scope.taxon);
				
				$scope.taxon.$promise.then(function() {
					
					if($scope.taxon.RankName === "sp."){
						$scope.superrank = "superspecies";
					} else if($scope.taxon.RankName ==="gen."){
						$scope.superrank = "supergenus";
					};
					
					
					
				$scope.taxon.Children = Taxon.query(
					{where : {parent_id: $scope.taxon._id},
					 order: "RankID ASC", 
					 limit: 10
				}).$promise.then(function(children){
					if(children.length >= 1){
						$scope.childRank = children[0].RankID;
						if($scope.taxon.RankID === 5000 && $scope.childRank >= 10000){
							$scope.childName = "Genus"
							$scope.childRank = 5000;
						} else if($scope.taxon.RankID === 10000 && $scope.childRank >= 10000){
							$scope.childName = "Species"
							$scope.childRank = 10000;
						} else {
							$scope.childName = children[0].TaxonName;
						}
						
					} else {
						if($scope.superrank === "superspecies"){
							$scope.childRank = 10000;
							$scope.childName = "Species";
						} else if($scope.superrank === "supergenus"){
							$scope.childRank = 5000;
							$scope.childName = "Genus";
						} ;
					};
					$scope.selectedSuperRankID = ($scope.taxon.RankName === "superspecies" || $scope.taxon.RankName === "supergenus") ? { superrankId :   $scope.taxon.RankID  } : { superrankId:   ( $scope.taxon.Parent.RankID + $scope.childRank) /2 };
				})
				});

				$scope.taxon.$promise.then(function() {
					$scope.$watch('taxon.images', function(newVal, oldVal) {
						if (newVal !== undefined && newVal !== oldVal) {
							$scope.currentImage = $scope.getCurrentImage();
						}
					}, true);

				})

			};

			$scope.getTaxon = function(viewValue, type) {
				
				if (viewValue === "") {
					return [];
				}
				var value = (viewValue.constructor.name === 'Resource') ? viewValue.FullName : viewValue;
				
				var params;
				if(type === "parent"){
					params = {
					where: {
						TaxonName: {
							like: value + "%"
						},
						RankID: {
							$lt: $scope.taxon.RankID
						}
					},
					order: "RankID DESC", 
					limit: 30
				};
			} else if(type === "synonym") {
				
				var RankID = {};
				
				if($scope.taxon.RankName === "var."){
					RankID['$between'] = [10000, 15000];
				} else if ($scope.taxon.RankName === "sp."){
					RankID['$between'] = [5001, 15000];
				} else if ($scope.taxon.RankName === "superspecies"){
					RankID['$between'] = [5000, 10000];
				} else if ($scope.taxon.RankName === "gen."){
					RankID['$between'] = [4000, 10000];
				} else if ($scope.taxon.RankName === "supergenus"){
					RankID['$between'] = [4000, 10000];
				} else {
					RankID['$between'] = [100, $scope.taxon.RankID +1000];
				};
				
				params = {
				where: {
					TaxonName: {
						like: value + "%"
					},
					RankID: RankID
				},
				limit: 30
			};
				
			}

				return Taxon.query(params).$promise;

			};
			
		

			$scope.$watch('selectedParentTaxon', function(newval, oldval) {
				if (typeof newval === "object" && newval.constructor.name === "Resource") {
					console.log(JSON.stringify(newval))
				}
			});

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
			
			$scope.saveNewTaxon = function(taxon){
				
				taxon.$save().then(function(t){
					$scope.taxon = t;
					$state.go('taxon', {id: taxon._id}, {inherit: false, notify: false});
				})
			}
			
			$scope.changeParent = function() {
				if ($scope.taxon._id === undefined) {
					$scope.taxon.Parent = $scope.selectedParentTaxon;
				} else {

					Taxon.setParent({
						id: $scope.taxon._id
					}, $scope.selectedParentTaxon).$promise.then(function(taxon) {

						$scope.taxon = taxon;
						
					})
				};
			}
			$scope.makeIntoSynonym = function(){
				
				$scope.taxon.accepted_id = $scope.selectedValidTaxon._id;
				
				Taxon.addSynonym({
					id: $scope.selectedValidTaxon._id
				}, $scope.taxon).$promise.then(function(taxon) {

					$scope.taxon = taxon;
					$state.go('taxon', {id: taxon._id}, {inherit: false, notify: false});
				})
			};
			
			$scope.unlinkSynonym = function(){
				$scope.taxon.accepted_id = $scope.taxon._id;
				$scope.taxon.$update().then(function(t){
					$scope.taxon = t;
					$state.go('taxon', {id: $scope.taxon._id}, {inherit: false, notify: false});
				})
			}
			
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
	])
	.filter('synonymsWithoutSelf', function() {
		return function(synonyms) {
			return _.filter(synonyms, function(s) {
				return s.accepted_id !== s._id;;
			});

		};
	});
