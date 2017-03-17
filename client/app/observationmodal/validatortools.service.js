'use strict';
angular.module('svampeatlasApp')
	.factory('ValidatorToolsService', function(Determination, Observation, ErrorHandlingService, $rootScope, $mdToast) {
		



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
			
				setPrimaryDetermination : function(det, obs){
					
							
					return Observation.setPrimaryDetermination({
															id: obs._id
														}, det).$promise.then(function(){
															$rootScope.$broadcast('observation_updated', obs);
														}).catch(function(err){
															ErrorHandlingService.handle500();
														
														})
				}
			};


		}

)
	




