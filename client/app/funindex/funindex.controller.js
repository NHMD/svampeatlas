'use strict';

angular.module('svampeatlasApp')
	.filter('parseHref', function() {

		return function(text) {
			var href = $(text).attr('href');
			//$(html).attr("target", "_blank");
			return href;
		};
	})
	.controller('FunindexCtrl', ['$scope', '$state', 'IndexFungorum', 'MycoBank', 'x2js', 'Taxon', 'TaxonIntegrationService',
		function($scope, $state, IndexFungorum, MycoBank, x2js, Taxon, TaxonIntegrationService) {

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
				if ($scope.dataSource === "IndexFungorum") {
				Taxon.query({
					where: {
						FunIndexNumber: taxon.RECORD_x0020_NUMBER
					}
				}).$promise.then(function(taxa) {

					if (taxa.length === 1) {
						$state.go('taxon', {
							id: taxa[0]._id
						})
						
					} else if (taxa.length === 0) {
						TaxonIntegrationService.dataSource = $scope.dataSource;
						
						IndexFungorum.NameByKey({
							NameKey: taxon.RECORD_x0020_NUMBER
						}).$promise.then(function(NameByKeyData) {
							
							TaxonIntegrationService.setTaxon(NameByKeyData.NameByKeyResult.NewDataSet.IndexFungorum, $scope.dataSource);
							$state.go('taxon', {
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
						FunIndexNumber: taxon.MycoBankNr_
					}
				}).$promise.then(function(taxa) {

					if (taxa.length === 1) {
						$state.go('taxon', {
							id: taxa[0]._id
						})
						
					} else if (taxa.length === 0) {
							
							
							taxon.SystematicPath = String(taxon.Classification_).replace(/<[^>]+>/gm, '');
							var regex = /<Id>(.*?)<\/Id>/ig;
						
							var match = regex.exec(taxon.CurrentName_Pt_);
							
							taxon.FunIndexCurrUseNumber = (match) ? match[1] : taxon.MycoBankNr_;
							
							regex = /<Name>(.*?)<\/Name>/ig;
						
							match = regex.exec(taxon.Rank_Pt_);
							
							
							taxon.RankName = (match) ? match[1] : undefined;
							
							TaxonIntegrationService.setTaxon(taxon, $scope.dataSource);
							
							$state.go('taxon', {
								id: 'new'
							})
							

						

					}

				})
				
			}

			};

		}
	]);
