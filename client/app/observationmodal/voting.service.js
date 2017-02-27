'use strict';
angular.module('svampeatlasApp')
	.factory('VotingService', function(Determination,$mdToast, ErrorHandlingService, $translate, Auth, $rootScope ) {
		
		
var user = Auth.getCurrentUser();
	
          function swapPrimaryDeterminationIfNeeded(observation, newPrimaryDeterminationId){
          			
			  if(observation.primarydetermination_id === newPrimaryDeterminationId){
				  return;
			  } else {
			  var newPrimaryDetermination =	_.find(observation.Determinations, function(d){
			  		return d._id === newPrimaryDeterminationId
			  	})
				
				observation.primarydetermination_id = newPrimaryDeterminationId;
				observation.PrimaryDetermination = newPrimaryDetermination;
				
				$rootScope.$broadcast('observation_updated', observation);
			  }
			
          }


			return {
				vote : function($event,obs, det, upOrDown) {

				// if the vote is already there delete it (its another click in same direction to remove it)
				if(det.vote === upOrDown){
					Determination.removeVote({
							id: det._id,
						userid: user._id
						})
						.$promise.then(function(res) {
							// TODO logic that removes the users vote or refreshes all votes
							det.score = res.newDeterminationScore;
							delete det.vote;
							_.remove(det.Votes, {
							    user_id: user._id
							});
							
							swapPrimaryDeterminationIfNeeded(obs, res.newPrimaryDeterminationId)
						})
						.catch(function(err) {
							if(err.status === 403){
								$mdToast.show(
									$mdToast.simple()
									.textContent($translate.instant("Du kan ikke stemme på dine egne bestemmelser"))
									.position("top right")
								
									.parent($event.currentTarget.parentElement.parentElement.parentElement)
									.hideDelay(3000)
								);
							
							
							
							} else {
								ErrorHandlingService.handle500();
							}
						
						})	
				} else {
					Determination.addVote({
							id: det._id
						}, {
							upOrDown: upOrDown
						})
						.$promise.then(function(res) {
							
								det.vote = upOrDown;
								det.Votes.push(res.vote)
								det.score = res.newDeterminationScore;
								swapPrimaryDeterminationIfNeeded(obs, res.newPrimaryDeterminationId);
								
						})
						.catch(function(err) {
							if(err.status === 403){
								$mdToast.show(
									$mdToast.simple()
									.textContent($translate.instant("Du kan ikke stemme på dine egne bestemmelser"))
									.position("top right")
								
									.parent($event.currentTarget.parentElement.parentElement.parentElement)
									.hideDelay(3000)
								);
							
							
							
							} else {
								ErrorHandlingService.handle500();
							}
						
						})	
				}


				//$($event.target).closest('ng-md-icon').addClass("green-thumb");
			


			}
			};


		}

)
	




