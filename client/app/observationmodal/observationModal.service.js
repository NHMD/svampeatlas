'use strict';
angular.module('svampeatlasApp')
	.factory('ObservationModalService', function($mdDialog, ObservationStateService, $rootScope) {
		
		

	


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
						onRemoving: function(element, removePromise){
							ObservationStateService.reset();
							removePromise.then(function(){
								$rootScope.$broadcast('dialogRemoved', referencedDataRow)
							})
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



