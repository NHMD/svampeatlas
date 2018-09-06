'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('metrics', {
        url: '/metrics',
		 title: 'Danmarks Svampeatlas', 
        templateUrl: 'app/metrics/metrics.html',
        controller: 'MetricsCtrl',
		  controllerAs: 'ctrl'
      });
  });