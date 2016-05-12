'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search-specieslist', {
		  params: {
		      where: null,
			  determinationViewWhere: null,
			  geometry: null
		    },
        url: '/search/result/specieslist/:searchterm?',
        templateUrl: 'app/searchresultspecieslist/searchresultspecieslist.html',
        controller: 'SearchSpeciesListCtrl'
      });
  });