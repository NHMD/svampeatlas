'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search-map', {
		  
        url: '/search/result/map',
        templateUrl: 'app/searchresultmap/searchresultmap.html',
        controller: 'SearchResultMapCtrl'
      });
  });