'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search-map', {
		  params: {
		      
			  taxon_id: null,
			  searchid : {value: null, squash: true}
		    },
        url: '/search/:searchid/result/map',
        templateUrl: 'app/searchresultmap/searchresultmap.html',
		title: 'Søgeresultat - Danmarks Svampeatlas',
			
        controller: 'SearchResultMapCtrl',
			 controllerAs : 'ctrl'
      });
  });