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
					controller: ['$rootScope', 'mdPanelRef', 'obs', '$cookies', '$translate', 'SearchService', 'Determination', 'Observation', 'Auth', function($rootScope, mdPanelRef, obs, $cookies, $translate, SearchService, Determination, Observation, Auth) {
						var that = this;
						this.Auth = Auth
						this.editMode = editMode;
						this._mdPanelRef = mdPanelRef;
						this.obs = obs;
						this.moment = moment;
						this.appConstants = appConstants;

						this.$translate = $translate;
						this.newTaxon = [];
						this.determiner = [];
						
						this.typeStatuses = [{
							value: 'HOLOTYPE',
							description: 'The one specimen or other element used or designated by the original author at the time of publication of the original description as the nomenclatural type of a species or infraspecific taxon.'
						}, {
							value: 'HYPOTYPE',
							description: 'A specimen that was not part of the original type series of the species, but is known from a published description, figure, or listing.'
						}, {
							value: 'EPITYPE',
							description: 'An epitype is a specimen or illustration selected to serve as an interpretative type when any kind of holotype, lectotype, etc.'
						}, {
							value: 'ISOTYPE',
							description: 'An isotype is any duplicate of the holotype'
						}, {
							value: 'NEOTYPE',
							description: 'A specimen designated as nomenclatural type subsequent to the publication of the original description in cases where the original holotype, lectotype, all paratypes and syntypes are lost or destroyed, or suppressed by the (botanical or zoological) commission on nomenclature.'
						}, {
							value: 'LECTOTYPE',
							description: 'A specimen or other element designated subsequent to the publication of the original description from the original material (syntypes or paratypes) to serve as nomenclatural type.'
						}, {
							value: 'PARATYPE',
							description: 'All of the specimens in the type series of a species or infraspecific taxon other than the holotype (and, in botany, isotypes).'
						}, {
							value: 'TOPOTYPE',
							description: 'One or more specimens collected at the same location as the type series (type locality), regardless of whether they are part of the type series.'
						}, {
							value: 'SYNTYPE',
							description: 'One of the series of specimens used to describe a species or infraspecific taxon when neither a single holotype nor a lectotype has been designated.'
						}]

						if (that.editMode === true) {
							that.newTaxon.push(that.obs.PrimaryDetermination.Taxon)
							that.determiner.push(that.obs.PrimaryDetermination.User)
							that.determination = that.obs.PrimaryDetermination;

						} else {
							that.determination = {
								confidence: 'sikker'
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


						that.confirmHigherTaxonDetermination = function() {
							if (that.obs.PrimaryDetermination.Taxon.parent_id === that.newTaxon[0]._id) {

								return confirm($translate.instant('Du angiver et forældre-taxon til') + " " + that.obs.PrimaryDetermination.Taxon.FullName + ". " + $translate.instant('Mener du at det helt sikkert ikke er denne art') + "?")
							} else {
								return true;
							}

						}

						that.saveDetermination = function() {

							that.determination.taxon_id = that.newTaxon[0]._id;
							if (that.determiner.length > 0) {
								that.determination.user_id = that.determiner[0]._id;
							}




							if (that.confirmHigherTaxonDetermination()) {
								updateOrCreate()
									.then(function(DeterminationView) {
										that.obs.DeterminationView = DeterminationView;
										return mdPanelRef.close()
									})
									.then(function() {
										$rootScope.$broadcast('observation_updated', obs);
										mdPanelRef.destroy();
									})
									.catch(function(err) {

										if (err.data.name === "SequelizeUniqueConstraintError") {
											$mdToast.show(
												$mdToast.simple()
												.textContent($translate.instant("Denne") + " " + $filter('lowercaseAll')($translate.instant(that.newTaxon[0].RankName)) + " " + $translate.instant("er allerede blevet foreslået."))
												.position("right")
												.parent(document.querySelectorAll('#determination-panel-content'))
												.hideDelay(3000)
											);
										} else {
											ErrorHandlingService.handle500();
										}


									});

							}


						};



					}],
				};

				$mdPanel.open(config);

			}
		}


	})
