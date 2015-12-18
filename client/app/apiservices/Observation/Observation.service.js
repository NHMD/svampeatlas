'use strict';

angular.module('svampeatlasApp')
	.factory('Observation', function($resource) {

		// Public API here
		return $resource('/api/observations/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT' // this method issues a PUT request
			}
			
		});

	});
