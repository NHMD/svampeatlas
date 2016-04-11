'use strict';
angular.module('svampeatlasApp')
	.factory('DeterminationModalService', function($mdDialog, appConstants) {

			return {
				show: function(ev, obs) {
			      $mdDialog.show({
					locals: {obs: obs},  
			        controller: ['$scope','$mdDialog','Taxon','Observation', 'obs','ObservationModalService',
					  				function($scope, $mdDialog,Taxon, Observation, obs, ObservationModalService) {
										$scope.obs = obs;
										$scope.newTaxon = [];
										$scope.determination = {confidence : 'sikker'};
										$scope.querySearch = function(query) {
											
											var RankID = ($scope.onlyHigherTaxa) ? {
												lt: 10000
											} : {
												gt: 5000
											};
											var where = {
												FullName: {
													like: "%" + query + "%"
												},
												RankID: RankID

											};

											var results = query ? Taxon.query({
												where: JSON.stringify(where),
												include: JSON.stringify([{
													model: "Taxon",
													as: 'acceptedTaxon'
												},{
													model: "TaxonDKnames",
													as: "Vernacularname_DK"
												}]),
												limit: 30

											}).$promise : [];

											return results;
										
										};
										
										  $scope.cancel = function() {
										    $mdDialog.hide()
											  .then(function(){
											  	ObservationModalService.show(null, $scope.obs)
											   });
										  };
										  $scope.reopenObs = function() {
											  $scope.determination.taxon_id = $scope.newTaxon[0]._id;
											Observation.addDetermination({id: $scope.obs._id}, $scope.determination).$promise
											  .then(function(DeterminationView){
												  $scope.obs.DeterminationView = DeterminationView; 
	  										   return  $mdDialog.hide()
											  }) 
											  .then(function(){
											  	ObservationModalService.show(null, $scope.obs)
											   }); 
										   
										  };
					  				}],
			        templateUrl: 'app/observationmodal/determination-modal.tpl.html',
			        parent: angular.element(document.body),
			        targetEvent: ev,
			        clickOutsideToClose:true,
			        fullscreen: false
			      })
				}
				}
			
			
			})