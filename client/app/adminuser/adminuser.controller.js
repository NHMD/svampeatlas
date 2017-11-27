'use strict';

angular.module('svampeatlasApp')
  .controller('AdminUserCtrl', function ($rootScope, $stateParams, MorphoGroup, $translate,  Auth, User, $mdToast) {
			  
	  var that = this;
			  this.Auth = Auth
			 
			  this.user_ = User.get({id: $stateParams.id});
			  
			this.$translate = $translate;
			this.morphoGroups = MorphoGroup.query();
			
			//that.user_.MorphoGroups = User.getMorphoGroups({id: $stateParams.id});
			that.Positions = User.getMorphoGroupPositions({id: $stateParams.id});
			this.selectMorphoGroup = function(morphogroupid){
			
			that.Positions.$promise.then(function(){
				var min = 1;
				var max = 100;
				var impact = 1;
				for(var i = 0; i< that.Positions.length; i++){
					if(that.Positions[i].morphogroup_id === parseInt(morphogroupid)){
						max = that.Positions[i].max_impact;
						min = that.Positions[i].min_impact;
						impact = that.Positions[i].impact;
						break;
					}
				}
			
				that.currentMorphogroup = { user_id: $stateParams.id, morphogroup_id: morphogroupid, max_impact:  max, min_impact:  min, impact: impact };
				});
			}
			
			that.saveUserMorphoGroupImpact = function($event, morphogroup){
				User.updateMorphoGroup({id: $stateParams.id, morphogroupid: morphogroup.morphogroup_id}, {impact: morphogroup.impact, min_impact: morphogroup.min_impact, max_impact: morphogroup.max_impact, morphogroup_id: morphogroup.morphogroup_id, user_id: $stateParams.id}).$promise.then(function(){
					$mdToast.show(
						$mdToast.simple()
						.textContent($translate.instant("Morfogruppe impact opdateret"))
						.position("top right")
											.hideDelay(3000)
					);
				})
				.catch(function(err){
					alert(err)
				})
			}


							
			
			
			
			})
