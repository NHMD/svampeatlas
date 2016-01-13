'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search-list', {
		  
        url: '/search/result/list/:searchterm?',
        templateUrl: 'app/searchresultlist/searchresultlist.html',
        controller: 'SearchListCtrl'
      });
  });