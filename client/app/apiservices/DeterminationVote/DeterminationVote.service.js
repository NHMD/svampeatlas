'use strict';

angular.module('svampeatlasApp')
	.factory('DeterminationVote', function($resource) {

		// Public API here
		return $resource('/api/votes/:id', {
			id: '@_id'
		}, {
			'getCount': {
				method: 'GET',
				url: '/api/votes/count',
				isArray: true
			}
			
		});

	});
