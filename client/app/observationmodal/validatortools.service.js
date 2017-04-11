'use strict';
angular.module('svampeatlasApp')
	.factory('ValidatorToolsService', function(Determination, Observation, ErrorHandlingService, $rootScope, $mdToast, $translate, VotingService) {
		



			return {
				updateValidation : function(validation, obs) {

					Determination.updateValidation({
							id: obs.PrimaryDetermination._id
						}, {
							validation: validation
						}).$promise
						.then(function(determination) {
							obs.PrimaryDetermination.validation = determination.validation;
						
							var txt = (determination.validation === "Afventer") ? "Bestemmelse afventer" : ("Fundet er " + determination.validation);
							
							$mdToast.show(
								$mdToast.simple()
								.textContent(txt)
								.position("top right")
								.parent(document.querySelectorAll('.speeddial-parent'))
								.hideDelay(3000)
							);
							
						
							return Observation.getDeterminations({id: obs._id})
							/*
							for(var i=0; i< $scope.obs.Determinations.length; i++){
								if($scope.obs.Determinations[i]._id === $scope.obs.PrimaryDetermination._id){
									$scope.obs.Determinations[i].validation = determination.validation;
								}
							}
							*/
						
						})
						.then(function(determinations) {
							obs.Determinations = determinations;
						
						})
						.catch(function(err) {

							ErrorHandlingService.handle500();
						})
				},
				updateConfidence : function( det, obs) {

					Determination.updateConfidence({
							id: det._id
						}, {
							confidence: det.confidence
						}).$promise
						.then(function(res) {
							//det.confidence = confidence;
						
							var txt =  $translate.instant("Bestemmelsens sikkerhed ændret til")+ " " + $translate.instant(det.confidence);
							
							$mdToast.show(
								$mdToast.simple()
								.textContent(txt)
								.position("bottom right")
								.hideDelay(3000)
							);
						
							VotingService
						
						
							det.score = res.newDeterminationScore;
							
							
							VotingService.swapPrimaryDeterminationIfNeeded(obs, res.newPrimaryDeterminationId);
							$rootScope.$broadcast('observation_updated', obs);
						
						
							/*
							for(var i=0; i< $scope.obs.Determinations.length; i++){
								if($scope.obs.Determinations[i]._id === $scope.obs.PrimaryDetermination._id){
									$scope.obs.Determinations[i].validation = determination.validation;
								}
							}
							*/
						
						})
						
						.catch(function(err) {

							ErrorHandlingService.handle500();
						})
				},
			
				setPrimaryDetermination : function(det, obs){
					
							
					return Observation.setPrimaryDetermination({
															id: obs._id
														}, det).$promise.then(function(){
															$rootScope.$broadcast('observation_updated', obs);
														}).catch(function(err){
															ErrorHandlingService.handle500();
														
														})
				},
				
				deleteDetermination : function(det, obs){
					
							
					return Determination.remove({id: det._id}).$promise.then(function(res){
						
						for(var i=0; i< obs.Determinations.length; i++){
								if(parseInt(obs.Determinations[i]._id) === parseInt(res.newprimarydermintaion_id)){
									obs.PrimaryDetermination = obs.Determinations[i];
									break;
								} 
							};
							for(var i=0; i< obs.Determinations.length; i++){
									if(parseInt(obs.Determinations[i]._id) === parseInt(det._id)){
										obs.Determinations.splice(i, 1);
										break;
									} 
								};
								$mdToast.show(
									$mdToast.simple()
									.textContent($translate.instant('Bestemmelsen blev slettet'))
									.position("bottom left")
									
									.hideDelay(3000)
								);
						
					})
				}
			};


		}

)
	




