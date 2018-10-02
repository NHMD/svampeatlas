'use strict';

angular.module('svampeatlasApp')
	.factory('DnaSequence', function($resource) {

		// Public API here
		return $resource('/api/dnasequences/:id', {
			id: '@_id'
		}, 
			{ 'remove': {
				method: 'DELETE',
				params: {
					id: '@_id'
				},
				url: '/api/dnasequences/:id'
			},
			
			
		});

	});
