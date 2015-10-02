'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonCtrl', ['$q', '$scope', 'Taxon', 'TaxonIntegrationService', 'TaxonTypeaheadService', 'TaxonAttributes', 'NatureTypes', '$state', '$stateParams', '$timeout', '$modal', 'IndexFungorum', 'ErrorHandlingService', '$mdDialog',
		function($q, $scope, Taxon, TaxonIntegrationService, TaxonTypeaheadService, TaxonAttributes, NatureTypes, $state, $stateParams, $timeout, $modal, IndexFungorum, ErrorHandlingService, $mdDialog) {
			$scope._ = _;
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
			
			$scope.possibleToChangeFunRecord = function(){
				if($scope.taxon.RankName === "superspecies" || $scope.taxon.RankName === "supergenus"){
					return $scope.taxon.Children.length === 0;
				} else {
					return $scope.taxon.Children !== undefined;
				}
				
			}
			$scope.detachFromFunRecord = function(){
				
			var confirm = $mdDialog.confirm()
				.title('Detach Index Fungorum record ?')
				.ariaLabel('Detach Index Fungorum record')
				.ok('Yes')
				.cancel('No');
			$mdDialog.show(confirm).then(function() {
				
				$scope.taxon.FunIndexNumber = null;
				$scope.taxon.FunIndexCurrUseNumber = null;
				$scope.taxon.FunIndexTypificationNumber = 0;
				
				return Taxon.update({
					id: $scope.taxon._id
				}, $scope.taxon).$promise.then(function(){
					delete $scope.taxon.FunIndexRecord;
				})
				
				
			}, function() {
				return false;
			});
				
				
				
			}


			$scope.$timeout = $timeout;
			$scope.stateParams = $stateParams;

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

				$scope.fetchingTaxon = true;
				$scope.taxon = Taxon.get({
					id: $stateParams.id
				})
				$scope.taxonAttributes = TaxonAttributes.get({
					id: $stateParams.id
				});
				

				$scope.taxon.$promise.then(function() {
					$scope.fetchingTaxon = false;
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


					 Taxon.query({
						where: {
							parent_id: $scope.taxon._id
						},
						order: "RankID ASC",
						include: JSON.stringify([{
							model: "TaxonAttributes",
							as: "attributes",
							fields: JSON.stringify(["PresentInDK"])}])
					}).$promise.then(function(children) {
						$scope.taxon.Children = children;
						
						var acceptedAndSyns = _.partition($scope.taxon.Children, function(n) {
						  return n._id === n.accepted_id || n.accepted_id === null;
						});
						$scope.numAcceptedChildren  = acceptedAndSyns[0].length;
						
						$scope.numSynChildren  = acceptedAndSyns[1].length;
						
						
						
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
						
						IndexFungorum.NameByKey({
							NameKey: $scope.taxon.FunIndexNumber
						}).$promise.then(function(NameByKeyData) {
							$scope.taxon.FunIndexRecord = NameByKeyData.NameByKeyResult.NewDataSet.IndexFungorum;
							$scope.FunIndexError = false;
						}).catch (function(){
							$scope.FunIndexError = "An error occurred, Index Fungorum may currently not be accessible"
						})
					})
				});

				$q.all([$scope.taxon.$promise, $scope.natureTypes.$promise]).then(function() {

					for (var i = 0; i < $scope.taxon.naturtyper.length; i++) {

						_.find($scope.natureTypes, function(nt) {
							return nt._id === $scope.taxon.naturtyper[i]._id;
						}).isChecked = true;
					}

				}).catch(function(err){
					if(err.status === 404){
						ErrorHandlingService.handleTaxon404();
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
			$scope.setDkPresence = function(child){
				
				Taxon.updateAttributes({id: child._id}, child.attributes)
				console.log(child._id +" : "+child.attributes.PresentInDK)
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
			
			$scope.funIndexModal = $modal({
				scope: $scope,
				templateUrl: 'app/taxon/funindex-modal.tpl.html',
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
