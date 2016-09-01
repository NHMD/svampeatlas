'use strict';
angular.module('svampeatlasApp')
	.factory('ObservationFormService', function($mdDialog, ObservationStateService) {

			return {
				show: function(ev, row, duplicateRecord) {

					ObservationStateService.set(row);
					if(duplicateRecord){
						ObservationStateService.duplicateRecord = true;
					}
					$mdDialog.show({
						controller: 'ObservationFormCtrl',
						templateUrl: 'app/observationform/observation-form-modal.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true,
						fullscreen: true
					})



				}
			};




		}

	)
