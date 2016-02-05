'use strict';

angular.module('svampeatlasApp')
	.factory('ObservationSearchService', function(Taxon) {

		
		return {
			

			search : {},
			
			uistate: {},
			
			getSearch: function() {
				return this.search ;
				
			},
			getUIstate: function() {
				return this.uistate ;
				
			},
			reset: function(){
				this.search = {};
			}
			
			}
		


	});

