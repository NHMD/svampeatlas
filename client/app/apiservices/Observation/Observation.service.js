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
			'getObservationsFlaggedForFrontpageAsNewDK': {
				method: 'GET',
				url: '/api/observations/newdk',
				isArray: true
			},
			'isOnFrontpageAsNewDK': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/observations/newdk/:id'
			},
			'flagObservationForFrontpageAsNewDK': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/observations/newdk/:id'
			},
			'removeObservationFromFrontpageAsNewDK': {
				method: 'DELETE',
				params: {
					id: '@_id'
				},
				url: '/api/observations/newdk/:id'
			},
			'getObservationsFlaggedForFrontpage': {
				method: 'GET',
				url: '/api/observations/frontpage',
				isArray: true
			},
			'isOnFrontpage': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/observations/frontpage/:id'
			},
			'flagObservationForFrontpage': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/observations/frontpage/:id'
			},
			'removeObservationFromFrontpage': {
				method: 'DELETE',
				params: {
					id: '@_id'
				},
				url: '/api/observations/frontpage/:id'
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
			'postNotification': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/observations/:id/notifications'
			},
			'getDeterminations': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/observations/:id/determinations',
				isArray: true
			},
			'addDetermination': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/observations/:id/determinations'
			},
			'setPrimaryDetermination': {
				method: 'PUT',
				params: {
					id: '@_id'
				},
				url: '/api/observations/:id/primarydetermination'
			},
			'addDnaSequence': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/observations/:id/dnasequence'
			},
			'addUser': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/observations/:id/users'
			},
			'getCount': {
				method: 'GET',
				url: '/api/observations/count',
				isArray: true
			},
			'getSpeciesCount': {
				method: 'GET',
				url: '/api/observations/count/species',
				isArray: true
			},
			'getUserCount': {
				method: 'GET',
				url: '/api/observations/count/users',
				isArray: true
			},
			'removeUser': {
				method: 'DELETE',
				params: {
					id: '@_id',
					userid: 'userid'
				},
				url: '/api/observations/:id/users/:userid'
			}
			
		});

	});
