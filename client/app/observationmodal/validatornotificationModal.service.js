'use strict';
angular.module('svampeatlasApp')
	.factory('ValidatorNotificationModalService', function($mdPanel, appConstants, $mdMedia, $mdToast, $translate, ErrorHandlingService, $filter, Observation) {

		return {
			show: function(ev, obs) {
				
				
	
				
  			  var config = {
  			    attachTo: angular.element(document.body),

  				locals: {
  					obs: obs
  				},
  			    controllerAs: 'ctrl',
  			    disableParentScroll: false,
  			    templateUrl: 'app/observationmodal/validatornotification-panel.tpl.html',
  			    hasBackdrop: true,
  			    panelClass: 'validator-form',
				/*
  			    position: $mdPanel.newPanelPosition()
		      .center(),
				*/
  			  //  trapFocus: true,
  			    zIndex: 85,
  			    clickOutsideToClose: true,
  			    escapeToClose: true,
  			    focusOnOpen: true,
				fullscreen: $mdMedia('xs'),
				/*
  				animation:   $mdPanel.newPanelAnimation()
  				  .openFrom(ev.currentTarget)
  				  .closeTo(ev.currentTarget)
  				  .withAnimation($mdPanel.animation.SCALE),
				*/
  			    controller: ['$rootScope','mdPanelRef'	,'obs',	'$translate',function ($rootScope, mdPanelRef, obs,  $translate) {
			  var that = this;
			 
			  this._mdPanelRef = mdPanelRef;
			  this.obs = obs;
			  this.moment = moment;
			  
			this.$translate = $translate;
			
			this.postNotification = function(message) {
				that.sendingNotification = true;
				Observation.postNotification({
						id: that.obs._id
					}, {
						message: message
					})
					.$promise.then(function() {
						

						that.sendingNotification = false;
		   			 mdPanelRef.close().then(function() {
 						$mdToast.show(
 							$mdToast.simple()
 							.textContent($translate.instant('Din notifikation er sendt til validator'))
 							.position("top right")
 							.hideDelay(3000)
 						);
		   			    mdPanelRef.destroy();
		   			  });
					  
						

					})
					.catch(function(err) {
						that.sendingNotification = false;
						ErrorHandlingService.handle500();
					})

			};
  			
			this.closeDialog = function() {
			 mdPanelRef.close().then(function() {
			    //angular.element(document.querySelector(ev.currentTarget)).focus();
			    mdPanelRef.destroy();
			  });
			};
			
			

			
			
			
			}],
  			  };
			  
			  $mdPanel.open(config);
					
			}
		}


	})
