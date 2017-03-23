'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('utm', {
		  title: 'UTM kvadrater', 
        url: '/utm',
        templateUrl: 'app/utm/utm.html',
        controller: 'UtmCtrl'
      });
  });