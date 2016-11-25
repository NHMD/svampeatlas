'use strict';

angular.module('svampeatlasApp')
	.factory('SimilarTaxa', function($resource) {

		// Public API here
		return $resource('/api/similartaxa/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
		
			
		});

	});
