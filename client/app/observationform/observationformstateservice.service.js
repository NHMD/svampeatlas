'use strict';

angular.module('svampeatlasApp')
	.factory('ObservationFormStateService', function() {

		
		return {
			

			state : {	},
			
			
			
			getState: function() {
				return this.state ;
				
			},
			
			reset: function(){
				delete this.state.Locality;
				delete this.state.observationDate;
				
			}
			
			}
		


	});

