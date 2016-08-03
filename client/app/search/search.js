'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search', {
		  title: 'Søg fund i Danmarks svampeatlas',  
        url: '/search',
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl'
      });
  });