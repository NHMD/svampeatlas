'use strict';
angular.module('svampeatlasApp')
	.factory('SimilarTaxaModalService', function($mdDialog, appConstants) {

		return {
			show: function(ev, taxon1, simTax) {
				$mdDialog.show({
					locals: {
						taxon1: taxon1,
						simTax : simTax
					},
					controller: ['$scope',  '$mdDialog',  'SimilarTaxa', 'taxon1', 'simTax',  '$translate', 'SearchService', '$state',
						function($scope,  $mdDialog, SimilarTaxa, taxon1, simTax, $translate, SearchService, $state) {
							$scope.$translate = $translate;

							$scope.querySearch = function(query) {
								return SearchService.querySearchTaxon(query, $scope.onlyHigherTaxa)
							}
							
							$scope.taxon1 = (simTax) ? simTax.Taxon1 : taxon1;
							$scope.newTaxon = [];
							if(simTax){
								$scope.newTaxon.push(simTax.Taxon2)
							}
							//	$scope.determination = {confidence : 'sikker'};
							$scope.similarTaxon = (simTax) ? simTax : { 
								taxon1_id : taxon1._id,
								
							};
							
							$scope.cancel = function() {
								$mdDialog.hide()
									
							};

							$scope.deleteSimilarTaxon = function(simTax){
								SimilarTaxa.delete({id: simTax._id}).$promise.then(function() {
										_.remove($scope.taxon1.similarTaxa, function(st) {
											return st === simTax;
										});
							})}

							$scope.saveSimilarTaxon = function(){
								$scope.similarTaxon.taxon2_id = $scope.newTaxon[0]._id;
								if(! $scope.similarTaxon._id){
									SimilarTaxa.save($scope.similarTaxon).$promise.then(function(smt){
										$mdDialog.hide().then(function(){
											taxon1.similarTaxa.push(smt)
										})
									})
								} else {
									SimilarTaxa.update({id: $scope.similarTaxon._id}, $scope.similarTaxon).$promise.then(function(smt){
										$mdDialog.hide().then(function(){
											_.remove(taxon1.similarTaxa, function(st) {
												return st._id === smt._id;
											});
											taxon1.similarTaxa.push(smt)
											
										})
									})
								}
								
							}


						}
					],
					templateUrl: 'app/similartaxamodal/similarTaxa-modal.tpl.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true
				})
			}
		}


	})
