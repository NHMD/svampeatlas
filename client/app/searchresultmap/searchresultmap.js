'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search-map', {
		  params: {
		      
			  taxon_id: null
		    },
        url: '/search/result/map',
        templateUrl: 'app/searchresultmap/searchresultmap.html',
        controller: 'SearchResultMapCtrl'
      });
  });