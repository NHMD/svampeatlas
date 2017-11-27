'use strict';

angular.module('svampeatlasApp')
	.factory('ObservationCountService', function(Observation) {

		var count = Observation.getCount({group: 'Decade', cached: true});
		return {

			getCount: function() {
				return count.$promise ;
				
			}
			
			}
		


	});

