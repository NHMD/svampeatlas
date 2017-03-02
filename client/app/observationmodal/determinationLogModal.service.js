'use strict';
angular.module('svampeatlasApp')
	.factory('DeterminationLogModalService', function($mdPanel, appConstants, $mdMedia, $mdToast, $translate, ErrorHandlingService, $filter) {

		return {
			show: function(ev, determination) {
				
				
	
				
  			  var config = {
  			    attachTo: angular.element(document.body),

  				locals: {
  					determination: determination
  				},
  			    controllerAs: 'ctrl',
  			    disableParentScroll: false,
  			    templateUrl: 'app/observationmodal/determinationlog-panel.tpl.html',
  			    hasBackdrop: true,
  			    panelClass: 'demo-dialog-example',
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
  			    controller: ['$rootScope','mdPanelRef'	,'determination',	'$translate', 'Determination',function ($rootScope, mdPanelRef, obs,  $translate, Determination) {
			  var that = this;
			 
			  this._mdPanelRef = mdPanelRef;
			  this.determination = determination;
			  this.moment = moment;
			  
			this.$translate = $translate;
			
			Determination.getLogs({id: determination._id}).$promise
			.then(function(logs){
				for(var i=0; i < logs.length; i++){
					logs[i].logObject = JSON.parse(logs[i].logObject)
				};
				that.logs = logs;
				
			});
			  
  			
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
