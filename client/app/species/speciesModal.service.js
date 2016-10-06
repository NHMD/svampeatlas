'use strict';
angular.module('svampeatlasApp')
	.factory('SpeciesModalService', function($mdDialog, $stateParams) {
		
		

	


			return {
				show: function(ev, taxon_id) {
					$stateParams.id= taxon_id;
					$stateParams.isModal = true;
					$mdDialog.show({
						controller: 'SpeciesCtrl',
						
						templateUrl: 'app/species/species-modal.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true,
						fullscreen: true,
						onRemoving: function(element, removePromise){
							delete $stateParams.id;
							delete $stateParams.isModal;
						}
					})



				}
			};


		}

)



