'use strict';
angular.module('svampeatlasApp')
	.factory('DeterminationModalService', function($mdDialog, appConstants) {

			return {
				show: function(ev, obs, sender) {
			      $mdDialog.show({
					locals: {obs: obs},  
			        controller: ['$scope','$mdDialog','Taxon','Observation', 'obs','ObservationModalService', 'ObservationFormService', 'User', '$translate',
					  				function($scope, $mdDialog,Taxon, Observation, obs, ObservationModalService, ObservationFormService, User, $translate) {
										$scope.obs = obs;
										$scope.newTaxon = [];
										$scope.determination = {confidence : 'sikker'};
										$scope.determiner = [];
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
										
										$scope.querySearchUser = function(query) {

											var results = query ? User.query({
												where: {
													$or: [{
														name: {
															like: query + "%"
														}
													}, {
														Initialer: {
															like: query + "%"
														}
													}]

												},
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
											  if($scope.determiner.length > 0){
											  	$scope.determination.user_id = $scope.determiner[0]._id;
											  }
											Observation.addDetermination({id: $scope.obs._id}, $scope.determination).$promise
											  .then(function(DeterminationView){
												  $scope.obs.DeterminationView = DeterminationView; 
	  										   return  $mdDialog.hide()
											  }) 
											  .then(function(){
												  if(sender === 'ObservationModalService'){
												  	ObservationModalService.show(null, $scope.obs)
												  }
												  if(sender === 'ObservationFormService'){
												  	ObservationFormService.show(null, $scope.obs)
												  }
											  	
											   }); 
										   
										  };
					  				}],
			        templateUrl: 'app/observationmodal/determination-modal.tpl.html',
			        parent: angular.element(document.body),
			        targetEvent: ev,
			        clickOutsideToClose:true,
			        fullscreen: true
			      })
				}
				}
			
			
			})