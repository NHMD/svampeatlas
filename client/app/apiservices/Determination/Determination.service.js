'use strict';

angular.module('svampeatlasApp')
	.factory('Determination', function($resource) {

		// Public API here
		return $resource('/api/determinations/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT' // this method issues a PUT request
			},
			'updateValidation': {
				method: 'PUT',
				params: {
					id: '@_id'
				},
				url: '/api/determinations/:id/validation'
			}
			
		});

	});
