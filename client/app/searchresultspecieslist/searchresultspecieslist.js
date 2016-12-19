'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search-specieslist', {
		  params: {
		      where: null,
			  determinationViewWhere: null,
			  geometry: null,
			  searchid : {value: null, squash: true}
		    },
        url: '/search/:searchid/result/specieslist/:searchterm?',
        templateUrl: 'app/searchresultspecieslist/searchresultspecieslist.html',
        controller: 'SearchSpeciesListCtrl'
      });
  });