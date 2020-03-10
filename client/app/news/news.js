'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('news', {
		parent: 'localization',  
		  
		  title: 'Nyheder fra Danmarks Svampeatlas', 
        url: '/news',
        templateUrl: 'app/news/news.html',
        controller: 'NewsCtrl'
      });
  });