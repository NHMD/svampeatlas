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
			},
			'addSynonym': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/synonyms',
				isArray: false
			},
			'addAttributes': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/attributes',
				isArray: false
			},
			'deleteAttributes': {
				method: 'DELETE',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/attributes',
				isArray: false
			},
			'updateAttributes': {
				method: 'PUT',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/attributes',
				isArray: false
			},
			'addTag': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/tags',
				isArray: false
			},
			'deleteTag': {
				method: 'DELETE',
				params: {
					id: '@_id',
					tagid: 'tagid'
				},
				url: '/api/taxons/:id/tags/:tagid',
				isArray: false
			},
			'getTags': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/tags',
				isArray: true
			},
			'addNatureType': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/naturetypes',
				isArray: false
			},
			'deleteNatureType': {
				method: 'DELETE',
				params: {
					id: '@_id',
					naturetypeid: 'naturetypeid'
				},
				url: '/api/taxons/:id/naturetypes/:naturetypeid',
				isArray: false
			},
			'getNatureTypes': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/naturetypes',
				isArray: true
			},
			'addNutritionStrategy': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/nutritionstrategies',
				isArray: false
			},
			'deleteNutritionStrategy': {
				method: 'DELETE',
				params: {
					id: '@_id',
					nutritionstrategyid: 'nutritionstrategyid'
				},
				url: '/api/taxons/:id/nutritionstrategies/:nutritionstrategyid',
				isArray: false
			},
			'getNutritionStrategies': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/nutritionstrategies',
				isArray: true
			},
			'addSpeciesHypothesis': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/specieshypothesis',
				isArray: false
			},
			'deleteSpeciesHypothesis': {
				method: 'DELETE',
				params: {
					id: '@_id',
					specieshypothesis: 'specieshypothesis'
				},
				url: '/api/taxons/:id/specieshypothesis/:specieshypothesis',
				isArray: false
			},
			'getSpeciesHypothesis': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/specieshypothesis',
				isArray: true
			},
			'getSiblings': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxons/:id/siblings',
				isArray: true
			}
		});

	});
