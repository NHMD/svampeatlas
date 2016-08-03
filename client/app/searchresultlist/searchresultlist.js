'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search-list', {
		  params: {
		      locality_id: null,
			  date: null,
			  taxon_id: null
		    },
        url: '/search/result/list/:searchterm?',
        templateUrl: 'app/searchresultlist/searchresultlist.html',
        controller: 'SearchListCtrl'
      });
  });