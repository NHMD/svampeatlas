'use strict';

angular.module('svampeatlasApp')
	.factory('Observation', function($resource) {

		// Public API here
		return $resource('/api/observations/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT' // this method issues a PUT request
			},
			'getSpeciesList': {
				method: 'GET',
				url: '/api/observations/specieslist',
				isArray: true
			},
			'getForum': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/observations/:id/forum',
				isArray: true
			},
			'postComment': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/observations/:id/forum'
			},
			'addDetermination': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/observations/:id/determinations'
			},
			
		});

	});
