'use strict';
angular.module('svampeatlasApp')
	.factory('DnaSequenceModalService', function($mdPanel, appConstants, $mdMedia, $mdToast, $translate, ErrorHandlingService, $filter) {

		return {
			show: function(ev, obs, sender, editMode) {




				var config = {
					attachTo: angular.element(document.body),

					locals: {
						obs: obs
					},
					controllerAs: 'ctrl',
					disableParentScroll: true,
					templateUrl: 'app/observationmodal/dnasequence-panel.tpl.html',
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
					controller: ['$rootScope', 'mdPanelRef', 'obs', '$cookies', '$translate', 'SearchService', 'Determination', 'Observation', 'Auth', function($rootScope, mdPanelRef, obs, $cookies, $translate, SearchService, Determination, Observation, Auth) {
						var that = this;
						this.Auth = Auth
						this._mdPanelRef = mdPanelRef;
						this.obs = obs;
						this.moment = moment;
						this.appConstants = appConstants;

						this.$translate = $translate;



						that.sequence = {
							marker: 'ITS'
						};




						this.closeDialog = function() {
							mdPanelRef.close().then(function() {
								//angular.element(document.querySelector(ev.currentTarget)).focus();
								mdPanelRef.destroy();
							});
						};






						that.saveDetermination = function() {

							
							Observation.addDnaSequence({
									id: that.obs._id
								}, that.sequence).$promise
								.then(function() {
									$rootScope.$broadcast('observation_updated', obs);
									mdPanelRef.destroy();
								})
								.catch(function(err) {

										ErrorHandlingService.handle500();
									


								});




						};



					}],
				};

				$mdPanel.open(config);

			}
		}


	})
