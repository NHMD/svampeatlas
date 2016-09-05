'use strict';


angular.module('svampeatlasApp')
	.factory('Taxon', function($resource) {

		// Public API here
		return $resource('/api/taxa/:id', {
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
				url: '/api/taxa/:id/parents',
				isArray: false
			},
			'getNumberOfDanishSpecies': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/danishspecies/count',
				isArray: true
			},
			'addImage': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/images',
				isArray: false
			},
			'deleteImage': {
				method: 'DELETE',
				params: {
					id: '@_id',
					imgid: 'imgid'
				},
				url: '/api/taxa/:id/images/:imgid',
				isArray: false
			},
			'updateImage': {
				method: 'PUT',
				params: {
					id: '@_id',
					imgid: 'imgid'
				},
				url: '/api/taxa/:id/images/:imgid',
				isArray: false
			},
			'setParent': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/parent',
				isArray: false
			},
			'addSynonym': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/synonyms',
				isArray: false
			},
			'addAttributes': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/attributes',
				isArray: false
			},
			'deleteAttributes': {
				method: 'DELETE',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/attributes',
				isArray: false
			},
			'updateAttributes': {
				method: 'PUT',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/attributes',
				isArray: false
			},
			'addTag': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/tags',
				isArray: false
			},
			'deleteTag': {
				method: 'DELETE',
				params: {
					id: '@_id',
					tagid: 'tagid'
				},
				url: '/api/taxa/:id/tags/:tagid',
				isArray: false
			},
			'getTags': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/tags',
				isArray: true
			},
			'addMycoKeyCharacter': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/mycokeycharacters',
				isArray: false
			},
			'deleteMycoKeyCharacter': {
				method: 'DELETE',
				params: {
					id: '@_id',
					characterid: 'characterid'
				},
				url: '/api/taxa/:id/mycokeycharacters/:characterid',
				isArray: false
			},
			'getMycoKeyCharacters': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/mycokeycharacters',
				isArray: true
			},
			'importMycoKeyCharacters': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/mycokeycharacters/import/',
				isArray: true
			},

			'addNatureType': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/naturetypes',
				isArray: false
			},
			'deleteNatureType': {
				method: 'DELETE',
				params: {
					id: '@_id',
					naturetypeid: 'naturetypeid'
				},
				url: '/api/taxa/:id/naturetypes/:naturetypeid',
				isArray: false
			},
			'getNatureTypes': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/naturetypes',
				isArray: true
			},
			'addNutritionStrategy': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/nutritionstrategies',
				isArray: false
			},
			'deleteNutritionStrategy': {
				method: 'DELETE',
				params: {
					id: '@_id',
					nutritionstrategyid: 'nutritionstrategyid'
				},
				url: '/api/taxa/:id/nutritionstrategies/:nutritionstrategyid',
				isArray: false
			},
			'getNutritionStrategies': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/nutritionstrategies',
				isArray: true
			},
			'addSpeciesHypothesis': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/specieshypothesis',
				isArray: false
			},
			'deleteSpeciesHypothesis': {
				method: 'DELETE',
				params: {
					id: '@_id',
					specieshypothesis: 'specieshypothesis'
				},
				url: '/api/taxa/:id/specieshypothesis/:specieshypothesis',
				isArray: false
			},
			'getSpeciesHypothesis': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/specieshypothesis',
				isArray: true
			},
			'getSiblings': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/siblings',
				isArray: true
			},
			'setCurrentDKname': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/dknames/current',
				isArray: false
			},
			'addDKname': {
				method: 'POST',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/dknames',
				isArray: false
			},
			'deleteDKname': {
				method: 'DELETE',
				params: {
					id: '@_id',
					nameid: 'nameid'
				},
				url: '/api/taxa/:id/dknames/:nameid',
				isArray: false
			},
			'updateDKname': {
				method: 'PUT',
				params: {
					id: '@_id',
					nameid: 'nameid'
				},
				url: '/api/taxa/:id/dknames/:nameid',
				isArray: false
			},
			'getAcceptedTaxon': {
				method: 'GET',
				params: {
					id: '@_id'
				},
				url: '/api/taxa/:id/acceptedtaxon',
				isArray: false
			},
		});

	});
