'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('metrics', {
        url: '/metrics',
        templateUrl: 'app/metrics/metrics.html',
        controller: 'MetricsCtrl',
		  controllerAs: 'ctrl'
      });
  });