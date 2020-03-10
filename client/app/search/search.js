'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search', {
		parent: 'localization',  
		  
		  title: 'Søg fund i Danmarks svampeatlas',  
        url: '/search/:searchid?',
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl'
      });
  });