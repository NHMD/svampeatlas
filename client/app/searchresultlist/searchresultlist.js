'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search-list', {
		  
        url: '/search/result/list',
        templateUrl: 'app/searchresultlist/searchresultlist.html',
        controller: 'SearchListCtrl'
      });
  });