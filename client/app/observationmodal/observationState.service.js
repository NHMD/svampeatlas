'use strict';
angular.module('svampeatlasApp')
	.factory('ObservationStateService', function() {
			var observation;
			
			return {
				set: function(obs) {
					observation = obs;
				},
				get: function() {
					return observation ;
				},
				reset: function(){
				observation = undefined;
				delete this.duplicateRecord;
				delete this.imageVisionOptions
				}
			};


		}

)




