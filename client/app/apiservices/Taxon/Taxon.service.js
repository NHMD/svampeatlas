'use strict';

angular.module('svampeatlasApp')
	.factory('Taxon', function($resource) {

		// Public API here
		return $resource('/api/taxons/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT' // this method issues a PUT request
			},
			'getParents': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/parents',
				isArray: false
			},
			'addImage': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/images',
				isArray: false
			},
			'deleteImage': {
				method: 'DELETE',
				params: {
					id: '@_id',
					imgid: 'imgid'
				},
				url: '/api/taxons/:id/images/:imgid',
				isArray: false
			},
			'updateImage': {
				method: 'PUT',
				params: {
					id: '@_id',
					imgid: 'imgid'
				},
				url: '/api/taxons/:id/images/:imgid',
				isArray: false
			},
			'setParent': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/parent',
				isArray: false
			}
		});

	});
