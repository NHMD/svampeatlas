'use strict';
angular.module('svampeatlasApp')
	.factory('DeterminationModalService', function($mdDialog, appConstants) {

		return {
			show: function(ev, obs, sender, editMode) {
				$mdDialog.show({
					locals: {
						obs: obs
					},
					controller: ['$scope', '$rootScope', '$mdDialog', 'Observation', 'Determination', 'obs', 'ObservationModalService', 'ObservationFormService', '$translate', 'SearchService', '$state',
						function($scope, $rootScope, $mdDialog, Observation, Determination, obs, ObservationModalService, ObservationFormService, $translate, SearchService, $state) {
							$scope.$translate = $translate;

							$scope.querySearch = function(query) {
								return SearchService.querySearchTaxon(query, $scope.onlyHigherTaxa)
							}
							$scope.editMode = editMode;
							$scope.obs = obs;
							$scope.newTaxon = [];
							//	$scope.determination = {confidence : 'sikker'};
							$scope.determiner = [];
							if ($scope.editMode === true) {
								$scope.newTaxon.push(obs.PrimaryDetermination.Taxon)
								$scope.determiner.push(obs.PrimaryDetermination.User)
								$scope.determination = obs.PrimaryDetermination;

							} else {
								$scope.determination = {
									confidence: 'sikker'
								};
							}


							$scope.querySearchUser = SearchService.querySearchUser;

							$scope.cancel = function() {
								$mdDialog.hide()
									.then(reopenObs);
							};

							function updateOrCreate() {
								if ($scope.editMode) {
									return Determination.update({
										id: $scope.determination._id
									}, $scope.determination).$promise
								} else {
									return Observation.addDetermination({
										id: $scope.obs._id
									}, $scope.determination).$promise
								}
							}

							function reopenObs() {
								if (sender === 'ObservationModalService') {
									ObservationModalService.show(null, $scope.obs)
								}
								if (sender === 'ObservationFormService') {
									ObservationFormService.show(null, $scope.obs)
								}
								if (sender === 'ObservationPage') {
									$state.go('observations', {
										observationid: obs._id
									}, {
										reload: true
									})
								}
								$rootScope.$broadcast('observation_updated', obs);
							}


							$scope.reopenObs = function() {
								$scope.determination.taxon_id = $scope.newTaxon[0]._id;
								if ($scope.determiner.length > 0) {
									$scope.determination.user_id = $scope.determiner[0]._id;
								}




								updateOrCreate()
									.then(function(DeterminationView) {
										$scope.obs.DeterminationView = DeterminationView;
										return $mdDialog.hide()
									})
									.then(reopenObs);

							};
						}
					],
					templateUrl: 'app/observationmodal/determination-modal.tpl.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true
				})
			}
		}


	})
