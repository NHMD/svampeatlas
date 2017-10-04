'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonCtrl', ['$q', '$scope', 'Taxon', 'TaxonIntegrationService', 'TaxonTypeaheadService', 'TaxonAttributes', 'NatureTypes', '$state', '$stateParams', '$timeout', '$modal', 'IndexFungorum', 'PlutoF', 'DynTaxa', 'ErrorHandlingService', '$mdDialog', '$translate', 'TaxonomyTags', '$cookies','MycokeyCharacters', 'Observation', 'ObservationModalService', 'SimilarTaxaModalService', 'SimilarTaxa','SearchService', 'appConstants',
		function($q, $scope, Taxon, TaxonIntegrationService, TaxonTypeaheadService, TaxonAttributes, NatureTypes, $state, $stateParams, $timeout, $modal, IndexFungorum, PlutoF, DynTaxa, ErrorHandlingService, $mdDialog, $translate, TaxonomyTags, $cookies, MycokeyCharacters, Observation, ObservationModalService, SimilarTaxaModalService, SimilarTaxa, SearchService, appConstants) {
			$scope.$translate = $translate;
			$scope._ = _;
			$scope.Taxon = Taxon;
			$scope.natureTypes = NatureTypes.query();
			$scope.taxonomyTags = TaxonomyTags.query();
			$scope.moment = moment;
			$scope.$state = $state;
			$scope.ObservationModalService = ObservationModalService;
			$scope.SimilarTaxaModalService = SimilarTaxaModalService;
			
			SearchService.getMorphoGroup().then(function(morphoGroup){
				$scope.morphoGroup = morphoGroup;
								
			})
			
			$scope.changeRankAndSave = function(taxon) {
				// If the taxon was a species or genus we are changing it to superspecies and therefore deattacing from fun, otherwise we are just changing rank level
				if (taxon.RankID === 5000 || taxon.RankID === 10000) {
					taxon.RankName = $scope.superrank;
					taxon.FunIndexNumber = null;
					taxon.FunIndexCurrUseNumber = null;
					taxon.FunIndexTypificationNumber = 0;
					taxon.GUID = "";
					if ($scope.superrank === "superspecies") {
						taxon.FullName = taxon.Parent.TaxonName + " " + taxon.TaxonName + " sensu lato";
						taxon.Author = "";
					};
					if ($scope.superrank === "supergenus") {
						taxon.FullName = taxon.TaxonName + " sensu lato";
						taxon.Author = "";
					};
				}


				taxon.RankID = $scope.selectedSuperRankID.superrankId;

				//$scope.selectedSuperRankID = undefined;
				var children = taxon.Children;
				taxon.$update().then(function() {
					$scope.taxon = taxon;
					$scope.taxon.Children = children;
					$scope.attachFunRecord();
					//$state.go('taxonlayout-taxon', {id: taxon._id}, {inherit: false, notify: false});
					$scope.calculateParentRanksForSlider($scope.taxon.Children);
					$scope.rankModal.hide();
				})

			};

			$scope.possibleToChangeFunRecord = function() {
				if (($scope.taxon.RankID < 10000 && $scope.taxon.RankID > 5000) || ($scope.taxon.RankID < 5000 && $scope.taxon.RankID > 4000)) {
					return $scope.taxon.Children !== undefined && $scope.taxon.Children.length === 0;
				} else {
					return $scope.taxon.Children !== undefined;
				}

			}
			$scope.detachFromFunRecord = function() {

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
					}, $scope.taxon).$promise.then(function() {
						delete $scope.taxon.FunIndexRecord;
					})


				}, function() {
					return false;
				});



			}

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

			$scope.calculateParentRanksForSlider = function(children) {

				if ($scope.taxon.RankID < 10001 && $scope.taxon.RankID > 5000) {
					$scope.superrank = "superspecies";
				} else if ($scope.taxon.RankID < 5001 && $scope.taxon.RankID > 4000) {
					$scope.superrank = "supergenus";
				};

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

				$scope.selectedSuperRankID = ($scope.taxon.Parent === null || ($scope.taxon.RankID < 10000 && $scope.taxon.RankID > 5000) || ($scope.taxon.RankID < 5000 && $scope.taxon.RankID > 4000)) ? {
					superrankId: $scope.taxon.RankID
				} : {
					superrankId: ($scope.taxon.Parent.RankID + $scope.childRank) / 2
				};
			}

			$scope.$timeout = $timeout;
			$scope.stateParams = $stateParams;

			if ($stateParams.id && $stateParams.id === 'new') {
				$scope.taxon = {};
				if (TaxonIntegrationService.taxon) {
					TaxonIntegrationService.taxon.then(function(taxon) {
						$scope.taxon = new Taxon(taxon);
						console.log($scope.taxon)
					})

				} else {
					$state.go('taxonomy')
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
						"title": "Merge all unset attributes from this taxon.<br/>All attributes currently present on " + $scope.taxon.FullName + " will be preserved.",
						"checked": false
					};

					$scope.overwritetooltip = {
						"title": "Overwrite all attributes of " + $scope.taxon.FullName + "<br />with those of this taxon.",
						"checked": false
					};

					
					Observation.query({
						order: 'observationDate ASC', 
						limit: 1,
						where: JSON.stringify({observationDateAccuracy: { $ne: 'invalid'}}),
						include: JSON.stringify([ JSON.stringify({
					model: "DeterminationView",
					as: "DeterminationView",
					attributes: ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName'],
							where: { $or: [{Determination_validation: ['Godkendt']}, {Determination_score: {
											$gte: appConstants.AcceptedDeterminationScore
										}}], Taxon_id: $scope.taxon.accepted_id}
				}),
				JSON.stringify({
					model: "Locality",
					as: 'Locality',
					where: {},
					required: true
				})
			])
					}).$promise.then(function(firstfinding){
						$scope.firstfinding = firstfinding[0];
						
						
					})
					
					Observation.query({
						order: 'observationDate DESC', 
						limit: 1,
						where: JSON.stringify({observationDateAccuracy: { $ne: 'invalid'}}),
						include: JSON.stringify([ JSON.stringify({
					model: "DeterminationView",
					as: "DeterminationView",
					attributes: ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName'],
							where: { $or: [{Determination_validation: ['Godkendt']}, {Determination_score: {
											$gte: appConstants.AcceptedDeterminationScore
										}}], Taxon_id: $scope.taxon.accepted_id}
				}),
				JSON.stringify({
					model: "Locality",
					as: 'Locality',
					where: {},
					required: true
				})])
					}).$promise.then(function(latestfinding){
						$scope.latestfinding = latestfinding[0];
					})
					
					SimilarTaxa.query({where: {$or: [{taxon1_id: $scope.taxon._id}, {taxon2_id: $scope.taxon._id}]}}).$promise.then(function(similarTaxa){
						$scope.taxon.similarTaxa = similarTaxa;
					})
					
					PlutoF.SpeciesHypothesis({
						search_query: $scope.taxon.FullName
					}).$promise.then(function(res) {
						$scope.specieshypotheses = res.results;
					})

					Taxon.query({
						where: {
							parent_id: $scope.taxon._id
						},
						order: "RankID ASC",
						include: JSON.stringify([{
							model: "TaxonAttributes",
							as: "attributes",
							fields: JSON.stringify(["PresentInDK"])
						}])
					}).$promise.then(function(children) {
						$scope.taxon.Children = children;

						var acceptedAndSyns = _.partition($scope.taxon.Children, function(n) {
							return n._id === n.accepted_id || n.accepted_id === null;
						});
						$scope.numAcceptedChildren = acceptedAndSyns[0].length;

						$scope.numSynChildren = acceptedAndSyns[1].length;

						$scope.calculateParentRanksForSlider($scope.taxon.Children);


						if($scope.taxon.FunIndexNumber){
							$scope.attachFunRecord();
						}


					}).then(function() {
						Taxon.getNumberOfDanishSpecies({
							id: $scope.taxon._id
						}).$promise.then(function(stats) {
							$scope.numberOfDanishSpecies = _.reduce(stats, function(sum, n) {
								return sum + parseInt(n.count);
							}, 0);
							
							
							var titleText = ($translate.use() === 'en') ? 'species recorded in Denmark: ' : 'arter i Danmark: '
							var seriesText = ($translate.use() === 'en') ? 'Species' : 'Arter';
							$scope.chartOptions = {
								options: {
									chart: {
										plotBackgroundColor: null,
										plotBorderWidth: null,
										plotShadow: false,
										type: 'pie'
									},
									title: {
										text: $scope.taxon.FullName +" - "  + $scope.numberOfDanishSpecies +" "+titleText
									},
									tooltip: {
										pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
									},
									plotOptions: {
										pie: {
											allowPointSelect: true,
											cursor: 'pointer',
											dataLabels: {
												enabled: true,
												format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f} %)',
												style: {
													color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
												}
											}
										},
							            series: {
							                cursor: 'pointer',
							                point: {
							                    events: {
							                        click: function () {
														$state.go('taxonlayout-taxon', {id: this.options._id})
							                            
							                        }
							                    }
							                }
							            }
									}
								},
								series: [{
									name: seriesText,
									colorByPoint: true,
									data: _.map(stats, function(e) {
										return {
											name: e.FullName,
											y: parseInt(e.count),
											_id: e._id
										}
									})
								}]
							}
							//$scope.stats =stats;
						})
					})
				});
				
				$scope.mycokeyCharacters = MycokeyCharacters.query();
				$scope.mycokeyGroups = MycokeyCharacters.getGroups();	
				$scope.mycokeyMap = {}; 
				$q.all([$scope.taxon.$promise, $scope.natureTypes.$promise, $scope.taxonomyTags.$promise, $scope.mycokeyCharacters.$promise, $scope.mycokeyGroups.$promise]).then(function() {
								
					for (var i = 0; i < $scope.taxon.naturtyper.length; i++) {

						_.find($scope.natureTypes, function(nt) {
							return nt._id === $scope.taxon.naturtyper[i]._id;
						}).isChecked = true;
					}

					for (var i = 0; i < $scope.taxon.tags.length; i++) {

						_.find($scope.taxonomyTags, function(tag) {
							return tag._id === $scope.taxon.tags[i]._id;
						}).isChecked = true;
					}

				})
				.then(function(){
					
					_.each($scope.mycokeyCharacters, function(c){
						$scope.mycokeyMap[c.CharacterID] = c;
					})
					
					_.each($scope.taxon.character1, function(c){
						$scope.mycokeyMap[c.CharacterID].isChecked = true;
						$scope.mycokeyMap[c.CharacterID].RealValueMin = c.RealValueMin;
						$scope.mycokeyMap[c.CharacterID].RealValueMax = c.RealValueMax;
					})
					
					
				}).
				catch (function(err) {
					if (err.status === 404) {
						ErrorHandlingService.handleTaxon404();
					}
				})




			};

			$scope.updateMycoKeyCharacter = function(characterId){
				if($scope.mycokeyMap[characterId].Type === 'Bool'){
					if($scope.mycokeyMap[characterId].isChecked) {
						Taxon.addMycoKeyCharacter({id: $scope.taxon._id}, $scope.mycokeyMap[characterId]);
					} else {
						Taxon.deleteMycoKeyCharacter({id: $scope.taxon._id, characterid: characterId})
					}
				} else if($scope.mycokeyMap[characterId].Type === 'Real') {
					if(!isNaN(parseFloat($scope.mycokeyMap[characterId].RealValueMin)) && !isNaN(parseFloat($scope.mycokeyMap[characterId].RealValueMax))) {
						Taxon.addMycoKeyCharacter({id: $scope.taxon._id}, $scope.mycokeyMap[characterId]);
					} 
				}
				
				
				
			}
			
			$scope.importMycoKeyCharacters = function(fromTaxon){
				Taxon.importMycoKeyCharacters({id: $scope.taxon._id}, fromTaxon).$promise.then(function(characters){
					
					
					_.each(characters, function(c){
						$scope.mycokeyMap[c.CharacterID].isChecked = true;
					})
					$scope.taxon.character1 = characters;
					alert(characters.length+" characters successfully imported.")
				})
					
			}
            
			$scope.$watch('selectedMycoKeyImportTaxon', function(newVal, oldVal){
				
				if(newVal && newVal._id && (newVal !== oldVal)){
					Taxon.getMycoKeyCharacters({id: newVal._id}).$promise.then(function(characters){
						$scope.suggestedImportCharacters = characters;
						
					})
				} else {
					delete $scope.suggestedImportCharacters;
				}
			})
			
			$scope.attachFunRecord = function() {
				IndexFungorum.NameByKey({
					NameKey: $scope.taxon.FunIndexNumber
				}).$promise.then(function(NameByKeyData) {
					$scope.taxon.FunIndexRecord = NameByKeyData.NameByKeyResult.NewDataSet.IndexFungorum;
					$scope.FunIndexError = false;
					return $scope.taxon.FunIndexRecord;
				}).then(function(FunIndexRecord){
					if(FunIndexRecord.BASIONYM_x0020_RECORD_x0020_NUMBER) {
						return IndexFungorum.NameByKey({
					NameKey: FunIndexRecord.BASIONYM_x0020_RECORD_x0020_NUMBER
				}).$promise.then(function(basionym){
					$scope.taxon.FunIndexBasionymRecord = basionym.NameByKeyResult.NewDataSet.IndexFungorum;
				})
					}
				
					
				})
				
				.
				catch (function() {
					$scope.FunIndexError = "An error occurred, Index Fungorum may currently not be accessible"
				})
			}

			$scope.TaxonTypeaheadService = TaxonTypeaheadService;


			$scope.isValidYear = function(year) {
				var yearPattern = /^(17|18|19|20)\d{2}$/

				if (parseInt(year) !== 0 && (!yearPattern.test(year) || (parseInt(year) > new Date().getFullYear()))) {
					return "You must enter a valid year";
				}
			}


			$scope.saveNewTaxon = function(taxon) {
				$scope.saveIsClicked = true;
				taxon.$save().then(function(t) {
					$scope.taxon = t;
					$scope.attachFunRecord();
					$scope.taxon.Children = [];
					$scope.calculateParentRanksForSlider([]);
					
					
					$state.go('taxonlayout-taxon', {
						id: taxon._id
					}, {
						inherit: false,
						notify: false
					});
					
					$scope.mycokeyCharacters = MycokeyCharacters.query();
					$scope.mycokeyGroups = MycokeyCharacters.getGroups();	
					$scope.mycokeyMap = {}; 
					
					$scope.selectedMycoKeyImportTaxon = $scope.taxon.Parent;
					return 	$q.all([$scope.mycokeyCharacters.$promise, $scope.mycokeyGroups.$promise])	


				}).then(function(){
					
					_.each($scope.mycokeyCharacters, function(c){
						$scope.mycokeyMap[c.CharacterID] = c;
					})
					
					$scope.mycokeyImportModal.show();
				})
					.
				catch (function(err) {
					$scope.saveIsClicked = false;
					ErrorHandlingService.handle500();
				})
			}

			$scope.changeParent = function() {
				if ($scope.taxon._id === undefined) {
					$scope.taxon.Parent = $scope.selectedParentTaxon;
				} else {

					Taxon.setParent({
						id: $scope.taxon._id
					}, $scope.selectedParentTaxon).$promise.then(function(taxon) {

						_.merge($scope.taxon, taxon);

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
			$scope.setDkPresence = function(child) {

				Taxon.updateAttributes({
					id: child._id
				}, child.attributes)
				console.log(child._id + " : " + child.attributes.PresentInDK)
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
			$scope.mycokeyImportModal = $modal({
				scope: $scope,
				templateUrl: 'app/taxon/mycokeyimport-modal.tpl.html',
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
			$scope.dkNameModal = $modal({
				scope: $scope,
				templateUrl: 'app/taxon/dkname-modal.tpl.html',
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

			// handles tags

			$scope.taxonHasTag = function(tagId) {

				return _.find($scope.taxon.tags, function(tag) {
					return tag._id === tagId;
				});
			};

			$scope.addOrRemoveTag = function(tag) {

				if (tag.isChecked && !$scope.taxonHasTag(tag._id)) {
					// create the type
					Taxon.addTag({
						id: $scope.taxon._id
					}, tag).$promise.then(function() {
						$scope.taxon.tags.push(tag)
					}).
					catch (function(err) {
						tag.isChecked = !tag.isChecked
					})
				} else if (!tag.isChecked && $scope.taxonHasTag(tag._id)) {
					// delete the type
					Taxon.deleteTag({
						id: $scope.taxon._id,
						tagid: tag._id
					}).$promise.then(function() {
						_.remove($scope.taxon.tags, function(t) {
							return t._id == tag._id;
						});
					}).
					catch (function(err) {
						tag.isChecked = !tag.isChecked
					})

				}

			}
			// handles links to UNITE species hypothesis

			$scope.addSpeciesHypothesis = function(newSpeciesHypothesis) {

				return Taxon.addSpeciesHypothesis({
					id: $scope.taxon._id,
				}, {
					specieshypothesis: newSpeciesHypothesis
				})
					.$promise.then(function(sh) {
						$scope.taxon.specieshypothesis.push(sh);
					})
			}

			$scope.saveSpeciesHypothesisToSvampeatlas = function(sh) {
				return Taxon.addSpeciesHypothesis({
					id: $scope.taxon._id,
				}, {
					specieshypothesis: sh.name
				})
					.$promise.then(function(sh) {
						$scope.taxon.specieshypothesis.push(sh);
					})
			}

			$scope.deleteSpeciesHypothesis = function(sh) {

				Taxon.deleteSpeciesHypothesis({
					id: $scope.taxon._id,
					specieshypothesis: sh.specieshypothesis
				})
					.$promise.then(function() {
						_.remove($scope.taxon.specieshypothesis, function(t) {
							return t.specieshypothesis == sh.specieshypothesis;
						});
					})
			}
			
			$scope.deleteSimilarTaxon = function(simTax){
				SimilarTaxa.delete({id: simTax._id}).$promise.then(function() {
						_.remove($scope.taxon.similarTaxa, function(st) {
							return st === simTax;
						});
			})}

			// handles integration to DynTaxa
			$scope.loginToDyntaxa = function() {
				if (!$cookies.get('dyntaxa')) {

					return DynTaxa.GetToken().$promise.then(function(res) {
						var exp = new Date();
						exp.setHours(exp.getHours() + 24);
						$cookies.put('dyntaxatoken', res.access_token, {
							expires: exp
						});

					})

				} else {
					var deferred = $q.defer();
					deferred.resolve()
					return deferred.promise;
				}
			}

			$scope.getInfoFromDyntaxa = function() {

				$scope.dyntaxa = {
					currentUse: function(dtn) {
						return (dtn['b:Taxon'][0]['b:ScientificName'][0] !== dtn['b:Name'][0]) ? ' - ' : 'Current use';
					},
					getStatus: function(dtn) {
						return $scope.dyntaxa.statuses[dtn['b:StatusId'][0]][0]['b:Description'][0];
					},
					loading: true
				};

				$scope.loginToDyntaxa().then(function() {
					$scope.dyntaxa.rawstatuses = DynTaxa.NameStatuses();
					$scope.dyntaxa.rawcategories = DynTaxa.NameCategories();
					$scope.dyntaxa.rawnames = DynTaxa.SynonymSearch({
						searchstring: $scope.taxon.FullName
					});

					$q.all([$scope.dyntaxa.rawstatuses.$promise, $scope.dyntaxa.rawcategories.$promise, $scope.dyntaxa.rawnames.$promise])
						.then(function() {
							$scope.dyntaxa.statuses = _.groupBy($scope.dyntaxa.rawstatuses, function(e) {
								return e['b:Id'][0]
							});
							_.each($scope.dyntaxa.rawnames, function(e) {
								if (typeof e['b:Description'][0] !== 'string') {
									e['b:Description'][0] = "";
								}
							});
							var sorted = _.groupBy($scope.dyntaxa.rawnames, function(e) {
								return e['b:CategoryId'][0]
							});
							$scope.dyntaxa.latinnames = sorted[0];
							$scope.dyntaxa.swedishnames = sorted[1];

							var sweName = _.find($scope.dyntaxa.swedishnames, function(dtn) {
								return dtn['b:Taxon'][0]['b:CommonName'][0] === dtn['b:Name'][0]
							});

							if (sweName) {
								$scope.dyntaxa.vernacularname_se = sweName['b:Taxon'][0]['b:CommonName'][0]
							}



							return _.find($scope.dyntaxa.rawnames, function(dtn) {
								return dtn['b:Taxon'][0]['b:ScientificName'][0] !== dtn['b:Name'][0]
							})['b:Taxon'][0]['b:Id'][0]
						})
						.then(function(dyntaxa_id) {

							return DynTaxa.AllParentTaxa({
								id: dyntaxa_id
							}).$promise;

						})
						.then(function(classification) {
							$scope.dyntaxa.classification = "";

							var node = classification;
							while (node["b:WebTaxonTreeNode"]) {
								$scope.dyntaxa.classification += node["b:WebTaxonTreeNode"][0]["b:Taxon"][0]["b:ScientificName"][0];
								if (node["b:WebTaxonTreeNode"][0]["b:Children"][0]["b:WebTaxonTreeNode"]) {
									$scope.dyntaxa.classification += ", "
								};
								node = node["b:WebTaxonTreeNode"][0]["b:Children"][0];
							}
							$scope.dyntaxa.loading = false;
						})
						.
					catch (function(err) {
						$scope.dyntaxa.loading = false;
						$scope.dyntaxa.noMatch = true;
					})

				})


			}

			// handles an array of danish names , one of these being the current name

			$scope.setCurrentDkName = function(name) {
				$scope.newDkNameIsInProgress = true;
				console.log(name)
				Taxon.setCurrentDKname({
					id: $scope.taxon._id,
				}, name)
					.$promise.then(function() {
						$scope.taxon.Vernacularname_DK = name;
						$scope.newDkNameIsInProgress = false;
					})


			};


			$scope.updateDkName = function(name) {

				$scope.newDkName = name;
				$scope.dkNameModal.show()
			}
			$scope.createNewDkName = function() {
				$scope.newDkName = {
					taxon_id: $scope.taxon._id,
					appliedLatinName: $scope.taxon.FullName
				};
				$scope.dkNameModal.show()
			}

			$scope.cancelNewName = function() {
				delete $scope.newDkName;
			}

			$scope.saveOrUpdateDkName = function() {
				if ($scope.newDkName.hasOwnProperty('_id')) {
					Taxon.updateDKname({
						id: $scope.taxon._id,
						nameid: $scope.newDkName._id
					}, $scope.newDkName).$promise.then(function(newname) {
						if ($scope.taxon.vernacularname_dk_id === $scope.newDkName._id) {
							$scope.taxon.Vernacularname_DK = $scope.newDkName;
							delete $scope.newDkName;
						}
					})
				} else {
					Taxon.addDKname({
						id: $scope.taxon._id
					}, $scope.newDkName).$promise.then(function(newname) {
						$scope.taxon.DanishNames.push(newname);
						delete $scope.newDkName;
					})
				}
			}

			$scope.deleteDkName = function(name) {

				var confirm = $mdDialog.confirm()
					.title('Delete ' + name.vernacularname_dk + ' ?')
					.ariaLabel('Delete ' + name.vernacularname_dk)
					.ok('Yes')
					.cancel('No');
				$mdDialog.show(confirm).then(function() {

					Taxon.deleteDKname({
						id: $scope.taxon._id,
						nameid: name._id
					}).$promise.then(function() {
						_.remove($scope.taxon.DanishNames, function(n) {
							return n._id === name._id;
						});

					})


				}, function() {
					return false;
				});


			}

			$scope.activePanel =  1;



		}
	]);
