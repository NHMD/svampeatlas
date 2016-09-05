'use strict';
angular.module('svampeatlasApp')
	.factory('ObservationModalService', function($mdDialog, ObservationStateService) {

			return {
				show: function(ev, referencedDataRow) {
					
					ObservationStateService.set(referencedDataRow);
					$mdDialog.show({
						controller: 'ObservationCtrl',
						
						templateUrl: 'app/observationmodal/observation-modal.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true,
						fullscreen: true,
						onRemoving: function(){
							ObservationStateService.reset();
						}
					})



				}
			};


		}

)
	
.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})
.filter('getUserNamesAsList', function() {
    return function(users) {
      return _.map(users, function(u){
		  return u.name;
      }).toString();
    }
})



