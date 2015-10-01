'use strict';

angular.module('svampeatlasApp')
	.controller('FunIdxModalCtrl', ['$scope', 'IndexFungorum', '$mdDialog', 'TaxonIntegrationService', 'Taxon',
		function($scope, IndexFungorum, $mdDialog, TaxonIntegrationService, Taxon) {
			
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
					$scope.funIdxrowCollection = _.filter(data.NameSearchResult.NewDataSet.IndexFungorum, function(tx){
						return TaxonIntegrationService.getRankID(tx.INFRASPECIFIC_x0020_RANK) > $scope.taxon.Parent.RankID;
					});
					
					$scope.funIsLoading = false;
					//	console.log(data)
				})
					.
				catch ($scope.handleError)
			};


			$scope.showConfirm = function(row) {
				// Appending dialog to document.body to cover sidenav in docs app
				var parentEl = angular.element("#funindexmodal");
				var confirm = $mdDialog.confirm()
					.parent(parentEl)
					.title('Overwrite Index Fungorum record with this:')
					.content('<em>' + row.NAME_x0020_OF_x0020_FUNGUS + '</em><br>')
					.ariaLabel('Overwrite Index Fungorum record')
					.ok('Yes')
					.cancel('No');
				$mdDialog.show(confirm).then(function() {
					$scope.setIdxFungorumRecord(row)
				}, function() {
					return false;
				});
			};

			$scope.setIdxFungorumRecord = function(row) {

				IndexFungorum.NameByKey({
					NameKey: row.RECORD_x0020_NUMBER
				}).$promise.then(function(NameByKeyData) {

					TaxonIntegrationService.setTaxon(NameByKeyData.NameByKeyResult.NewDataSet.IndexFungorum, 'IndexFungorum');
					
					return TaxonIntegrationService.taxon.then(function(taxon) {
						
						_.merge($scope.taxon, taxon);
						$scope.taxon.FunIndexRecord = NameByKeyData.NameByKeyResult.NewDataSet.IndexFungorum;
						console.log($scope.taxon)
								
						return Taxon.update({
							id: $scope.taxon._id
						}, $scope.taxon).$promise.then(function(){
							$scope.funIndexModal.hide();
						})
						

					});

				})
					.
				catch ($scope.handleError)


			}
		}
	]);
