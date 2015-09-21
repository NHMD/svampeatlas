'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonCtrl', ['$q', '$scope', 'Taxon', 'TaxonIntegrationService', 'TaxonTypeaheadService', 'TaxonAttributes', 'NatureTypes', '$state', '$stateParams', '$timeout', '$modal',
		function($q, $scope, Taxon, TaxonIntegrationService, TaxonTypeaheadService, TaxonAttributes, NatureTypes, $state, $stateParams, $timeout, $modal) {
			console.log("taxon")
			$scope.Taxon = Taxon;
			$scope.natureTypes = NatureTypes.query();

			$scope.changeRankAndSave = function(taxon) {

				taxon.RankName = $scope.superrank;
				taxon.RankID = $scope.selectedSuperRankID.superrankId;
				taxon.FunIndexNumber = null;
				taxon.FunIndexCurrUseNumber = null;
				taxon.FunIndexTypificationNumber = 0;
				taxon.GUID = "";
				if ($scope.superrank === "superspecies") {
					taxon.FullName = taxon.Parent.TaxonName + " " + taxon.TaxonName + " s. lato";
					taxon.Author = "";
				};
				if ($scope.superrank === "supergenus") {
					taxon.FullName = taxon.TaxonName + " s. lato";
					taxon.Author = "";
				};

				//$scope.selectedSuperRankID = undefined;

				taxon.$update().then(function(t) {
					$scope.taxon = t;
					//$state.go('taxonlayout-taxon', {id: taxon._id}, {inherit: false, notify: false});
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
				$scope.taxonAttributes = TaxonAttributes.get({
					id: $stateParams.id
				});
				console.log($scope.taxon);

				$scope.taxon.$promise.then(function() {

					$scope.saveIsClicked = false;

					$scope.mergetooltip = {
						"title": "Merge all unset attributes from this taxon.<br />All attributes currently present on " + $scope.taxon.FullName + " will be preserved.",
						"checked": false
					};

					$scope.overwritetooltip = {
						"title": "Overwrite all attributes of " + $scope.taxon.FullName + "<br />with those of this taxon.",
						"checked": false
					};

					if ($scope.taxon.RankName === "sp.") {
						$scope.superrank = "superspecies";
					} else if ($scope.taxon.RankName === "gen.") {
						$scope.superrank = "supergenus";
					};



					$scope.taxon.Children = Taxon.query({
						where: {
							parent_id: $scope.taxon._id
						},
						order: "RankID ASC",
						limit: 10
					}).$promise.then(function(children) {
						if (children.length >= 1) {
							$scope.childRank = children[0].RankID;
							if ($scope.taxon.RankID === 5000 && $scope.childRank >= 10000) {
								$scope.childName = "Genus"
								$scope.childRank = 5000;
							} else if ($scope.taxon.RankID === 10000 && $scope.childRank >= 10000) {
								$scope.childName = "Species"
								$scope.childRank = 10000;
							} else {
								$scope.childName = children[0].TaxonName;
							}

						} else {
							if ($scope.superrank === "superspecies") {
								$scope.childRank = 10000;
								$scope.childName = "Species";
							} else if ($scope.superrank === "supergenus") {
								$scope.childRank = 5000;
								$scope.childName = "Genus";
							};
						};
						$scope.selectedSuperRankID = ($scope.taxon.RankName === "superspecies" || $scope.taxon.RankName === "supergenus") ? {
							superrankId: $scope.taxon.RankID
						} : {
							superrankId: ($scope.taxon.Parent.RankID + $scope.childRank) / 2
						};
					})
				});

				$q.all([$scope.taxon.$promise, $scope.natureTypes.$promise]).then(function() {

					for (var i = 0; i < $scope.taxon.naturtyper.length; i++) {

						_.find($scope.natureTypes, function(nt) {
							return nt._id === $scope.taxon.naturtyper[i]._id;
						}).isChecked = true;
					}

				})


			};

			$scope.TaxonTypeaheadService = TaxonTypeaheadService;


			$scope.isValidYear = function(year) {
				var yearPattern = /^(19|20)\d{2}$/

				if (!yearPattern.test(year) || (parseInt(year) > new Date().getFullYear())) {
					return "You must enter a valid year";
				}
			}

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

			$scope.saveNewTaxon = function(taxon) {
				$scope.saveIsClicked = true;
				taxon.$save().then(function(t) {
					$scope.taxon = t;
					$state.go('taxonlayout-taxon', {
						id: taxon._id
					}, {
						inherit: false,
						notify: false
					});
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
			$scope.makeIntoSynonym = function() {

				$scope.taxon.accepted_id = $scope.selectedValidTaxon._id;

				Taxon.addSynonym({
					id: $scope.selectedValidTaxon._id
				}, $scope.taxon).$promise.then(function(taxon) {

					$scope.taxon = taxon;
					$state.go('taxonlayout-taxon', {
						id: taxon._id
					}, {
						inherit: false,
						notify: false
					});
				})
			};

			$scope.unlinkSynonym = function() {
				$scope.taxon.accepted_id = $scope.taxon._id;
				$scope.taxon.$update().then(function(t) {
					$scope.taxon = t;
					$state.go('taxonlayout-taxon', {
						id: $scope.taxon._id
					}, {
						inherit: false,
						notify: false
					});
				})
			}

			$scope.mergeWithSynTaxon = function(syn) {

				TaxonAttributes.get({
					id: syn._id
				}).$promise.then(function(synAttributes) {
					//	alert(syn_id)
					angular.forEach($scope.taxon.attributes, function(value, key) {

						if (key !== 'taxon_id' && !value && synAttributes[key]) {
							$scope.taxon.attributes[key] = synAttributes[key];
							$scope.taxonAttributesUnsaved = true;
						}
					});
				})

			};

			$scope.overWriteFromSynTaxon = function(syn) {
				if (confirm("Overwrite all attributes of " + $scope.taxon.FullName + " with those of " + syn.FullName + " ?")) {
					TaxonAttributes.get({
						id: syn._id
					}).$promise.then(function(synAttributes) {
						//	alert(syn_id)
						angular.forEach(synAttributes, function(value, key) {

							if (key !== 'taxon_id' && value) {
								$scope.taxon.attributes[key] = value;
								$scope.taxonAttributesUnsaved = true;
							}
						});
					})
				};
			};

			$scope.parentModal = $modal({
				scope: $scope,
				templateUrl: 'app/taxon/parent-modal.tpl.html',
				show: false
			});
			$scope.rankModal = $modal({
				scope: $scope,
				templateUrl: 'app/taxon/rank-modal.tpl.html',
				show: false
			});

			$scope.synonymModal = $modal({
				scope: $scope,
				templateUrl: 'app/taxon/synonym-modal.tpl.html',
				show: false
			});

			$scope.taxonHasNatureType = function(natureTypeId) {

				return _.find($scope.taxon.naturtyper, function(nt) {
					return nt._id === natureTypeId;
				});
			};

			$scope.addOrRemoveNatureType = function(type) {

				if (type.isChecked && !$scope.taxonHasNatureType(type._id)) {
					// create the type
					Taxon.addNatureType({
						id: $scope.taxon._id
					}, type).$promise.then(function() {
						$scope.taxon.naturtyper.push(type)
					}).
					catch (function(err) {
						type.isChecked = !type.isChecked
					})
				} else if (!type.isChecked && $scope.taxonHasNatureType(type._id)) {
					// delete the type
					Taxon.deleteNatureType({
						id: $scope.taxon._id,
						naturetypeid: type._id
					}).$promise.then(function() {
						_.remove($scope.taxon.naturtyper, function(t) {
							return t._id == type._id;
						});
					}).
					catch (function(err) {
						type.isChecked = !type.isChecked
					})

				}

			}

		}
	]);
