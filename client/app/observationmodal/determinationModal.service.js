'use strict';
angular.module('svampeatlasApp')
	.factory('DeterminationModalService', function($mdPanel, appConstants, $mdMedia, $mdToast, $translate, ErrorHandlingService, $filter) {

		return {
			show: function(ev, obs, sender, editMode) {
				
				
	
				
  			  var config = {
  			    attachTo: angular.element(document.body),

  				locals: {
  					obs: obs
  				},
  			    controllerAs: 'ctrl',
  			    disableParentScroll: true,
  			    templateUrl: 'app/observationmodal/determination-panel.tpl.html',
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
  			    controller: ['$rootScope','mdPanelRef'	,'obs',	'$cookies' ,'$translate', 'SearchService', 'Determination', 'Observation', 'Auth',function ($rootScope, mdPanelRef, obs, $cookies, $translate, SearchService, Determination, Observation, Auth) {
			  var that = this;
			  this.Auth = Auth
			  this.editMode = editMode;
			  this._mdPanelRef = mdPanelRef;
			  this.obs = obs;
			  this.moment = moment;
			  
			this.$translate = $translate;
			this.newTaxon = [];
			this.determiner = [];
			
			if (that.editMode === true) {
				that.newTaxon.push(that.obs.PrimaryDetermination.Taxon)
				that.determiner.push(that.obs.PrimaryDetermination.User)
				that.determination = that.obs.PrimaryDetermination;

			} else {
				that.determination = {
					confidence : 'sikker'
				};
				
				that.determination.validation = (sender === 'validatorbutton') ? "Godkendt" : "Valideres";
			}
			
			
			
			this.querySearchUser = SearchService.querySearchUser;
			this.querySearch = function(query) {
				return SearchService.querySearchTaxon(query, that.onlyHigherTaxa)
			}
			  
			  
  			
			this.closeDialog = function() {
			 mdPanelRef.close().then(function() {
			    //angular.element(document.querySelector(ev.currentTarget)).focus();
			    mdPanelRef.destroy();
			  });
			};
			
			
							function updateOrCreate() {
								if (that.editMode) {
									return Determination.update({
										id: that.determination._id
									}, that.determination).$promise
								} else {
									return Observation.addDetermination({
										id: that.obs._id
									}, that.determination).$promise
								}
							}




							that.saveDetermination = function() {
								that.determination.taxon_id = that.newTaxon[0]._id;
								if (that.determiner.length > 0) {
									that.determination.user_id = that.determiner[0]._id;
								}




								updateOrCreate()
									.then(function(DeterminationView) {
										that.obs.DeterminationView = DeterminationView;
										return mdPanelRef.close()
									})
									.then(function(){
									   $rootScope.$broadcast('observation_updated', obs);
									    mdPanelRef.destroy();
									})
									.catch(function(err){
										
										if(err.data.name === "SequelizeUniqueConstraintError"){
											$mdToast.show(
												$mdToast.simple()
												.textContent($translate.instant("Denne") +" "+$filter('lowercaseAll')($translate.instant(that.newTaxon[0].RankName))+" "+$translate.instant("er allerede blevet foreslået."))
												.position("right")
												.parent(document.querySelectorAll('#determination-panel-content'))
												.hideDelay(3000)
											);
										} else {
											ErrorHandlingService.handle500();
										}
										
										
									});

							};
			
			
			
			}],
  			  };
			  
			  $mdPanel.open(config);
					
			}
		}


	})
