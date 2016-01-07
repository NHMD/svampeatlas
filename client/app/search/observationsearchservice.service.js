'use strict';

angular.module('svampeatlasApp')
	.factory('ObservationSearchService', function(Taxon) {

		
		return {
			

			search : {},
			
			getSearch: function() {
				return this.search ;
				
			},
			
			}
		


	});

