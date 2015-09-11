'use strict';

angular.module('svampeatlasApp')
	.filter('parseHref', function() {

		return function(text) {
			var href = $(text).attr('href');
			//$(html).attr("target", "_blank");
			return href;
		};
	})
	.filter('higherRanksThanParent', function() {
		return function(ranks, parent) {
			return (parent !== undefined) ? _.filter(ranks, function(s) {
				return s.RankID > parent.RankID;
			}) : ranks;

		};
	})
	.controller('FunindexCtrl', ['$scope', '$state', 'IndexFungorum', 'MycoBank', 'x2js', 'Taxon', 'TaxonIntegrationService','TaxonTypeaheadService', 'TaxonRank',
		function($scope, $state, IndexFungorum, MycoBank, x2js, Taxon, TaxonIntegrationService, TaxonTypeaheadService, TaxonRank) {
			$scope.TaxonTypeaheadService = TaxonTypeaheadService;
			$scope.TaxonRanks = TaxonRank.query();
			$scope.selectedTaxonAuthor = "";
			$scope.newTaxonIsValid = function(){
				
				var auhtorIsValid = ($scope.selectedTaxonAuthor) ? true: false;
				if($scope.selectedTaxonRank && ($scope.selectedTaxonRank.RankName === 'superspecies' || $scope.selectedTaxonRank.RankName === 'supergenus')){
					auhtorIsValid = true;
				}
				return ($scope.selectedParentTaxon !== undefined && $scope.selectedParentTaxon.constructor.name === 'Resource') 
				&& $scope.selectedTaxonRank && $scope.selectedTaxonName && auhtorIsValid;
				
			}
			$scope.saveNewTaxon = function(){
				var FullName;
				if($scope.selectedTaxonRank.RankID < 10000){
					FullName = $scope.selectedTaxonName +" "+ $scope.selectedTaxonAuthor;
				} else if($scope.selectedTaxonRank.RankID === 10000){
					FullName = $scope.selectedParentTaxon.TaxonName +" "+$scope.selectedTaxonName +" "+ $scope.selectedTaxonAuthor;
				} else {
					FullName = $scope.selectedParentTaxon.FullName +" "+$scope.selectedTaxonRank.RankName+" "+$scope.selectedTaxonName +" "+ $scope.selectedTaxonAuthor;
				}
				var taxon = new Taxon({
					parent_id: $scope.selectedParentTaxon._id,
					TaxonName : $scope.selectedTaxonName,
					RankName: $scope.selectedTaxonRank.RankName,
					RankID: $scope.selectedTaxonRank.RankID,
					Author: $scope.selectedTaxonAuthor,
					FullName: FullName,
					FunIndexNumber: 0,
					FunIndexCurrUseNumber: 0,
					FunIndexTypificationNumber: 0,
					PresentInDK: 0,
					Parent: $scope.selectedParentTaxon
				}).$save().then(function(taxon){
					$state.go('taxonlayout-taxon', {
						id: taxon._id
					})
				})
			}
			
			$scope.handleError = function(err) {
				$scope.errorMsg = err.status + " " + err.statusText + " " + err.data;
				$scope.isLoading = false;
			}

			$scope.searchParams = {
				AnywhereInText: "false",
				MaxNumber: 100
			};

			$scope.getDataFromFUN = function() {

				$scope.rowCollection = undefined;
				IndexFungorum.NameSearch($scope.searchParams).$promise.then(function(data) {
					$scope.rowCollection = data.NameSearchResult.NewDataSet.IndexFungorum;
					$scope.isLoading = false;
					//	console.log(data)
				})
					.
				catch ($scope.handleError)
			};

			$scope.getDataFromMycoBank = function(params) {

				$scope.rowCollectionMycobank = undefined;
				MycoBank.query(params).$promise.then(function(data) {
					if (data.Error) {
						$scope.errorMsg = "MycoBank responded with: " + data.Error.ErrorMessage;
					} else {
						var result = data.Results.Taxon;

						if (result) {
							//If we get inly one match, put in an array
							if(!result.length){
								result = [result];
							}
							var x2js = new X2JS();
							for (var i = 0; i < result.length; i++) {

								angular.forEach(result[i], function(value, key) {

									if (value.substring(0, 1) === "<") {
										var newVal = x2js.xml_str2json(value);
										if (newVal) {
											result[i][key] = newVal;
										}
									}
								})

							}
						}

						$scope.rowCollectionMycobank = result;
					};


					$scope.isLoading = false;


				}).
				catch ($scope.handleError)
			};

			$scope.getData = function() {
				$scope.isLoading = true;
				$scope.errorMsg = undefined;
				if ($scope.dataSource === "IndexFungorum") {
					$scope.getDataFromFUN();
				} else if ($scope.dataSource === "MycoBank") {

					var operator = ($scope.searchParams.AnywhereInText === "true") ? "CONTAINS" : "STARTSWITH";

					$scope.getDataFromMycoBank({
						operator: operator,
						name: $scope.searchParams.SearchText,
						limit: $scope.searchParams.MaxNumber
					});
				}

			}

			$scope.addToTaxonBase = function(taxon) {
				console.log(taxon)
				if ($scope.dataSource === "IndexFungorum") {
				Taxon.query({
					where: {
						FunIndexNumber: taxon.RECORD_x0020_NUMBER
					}
				}).$promise.then(function(taxa) {

					if (taxa.length === 1) {
						$state.go('taxonlayout-taxon', {
							id: taxa[0]._id
						})
						
					} else if (taxa.length === 0) {
						TaxonIntegrationService.dataSource = $scope.dataSource;
						
						IndexFungorum.NameByKey({
							NameKey: taxon.RECORD_x0020_NUMBER
						}).$promise.then(function(NameByKeyData) {
							
							TaxonIntegrationService.setTaxon(NameByKeyData.NameByKeyResult.NewDataSet.IndexFungorum, $scope.dataSource);
							$state.go('taxonlayout-taxon', {
								id: 'new'
							})
							

						})
							.
						catch ($scope.handleError)

					}

				})
				
			} else if ($scope.dataSource === "MycoBank") {
				
				Taxon.query({
					where: {
						FunIndexNumber: taxon.mycobanknr_
					}
				}).$promise.then(function(taxa) {

					if (taxa.length === 1) {
						$state.go('taxonlayout-taxon', {
							id: taxa[0]._id
						})
						
					} else if (taxa.length === 0) {
							
							
							taxon.SystematicPath = String(taxon.classification_).replace(/<[^>]+>/gm, '');
						
						/*
							var regex = /<Id>(.*?)<\/Id>/ig;
						
							var match = regex.exec(taxon.currentname_pt_.TargetRecord.Id);
							*/
							
							taxon.FunIndexCurrUseNumber = (taxon.currentname_pt_ && taxon.currentname_pt_.TargetRecord.Id) ? taxon.currentname_pt_.TargetRecord.Id : taxon.mycobanknr_;
							
						/*
							regex = /<Name>(.*?)<\/Name>/ig;
						
							match = regex.exec(taxon.rank_pt_.TargetRecord.Name);
							*/
							
							taxon.RankName = (taxon.rank_pt_.TargetRecord.Name) ? taxon.rank_pt_.TargetRecord.Name: undefined;
							
							TaxonIntegrationService.setTaxon(taxon, $scope.dataSource);
							
							$state.go('taxonlayout-taxon', {
								id: 'new'
							})
							
					}

				})
				
			}

			};
			
		

		}
	]);
