'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('validation', {
		  title: 'Kvalitetssikring af data', 
        url: '/validation',
        templateUrl: 'app/validation/validation.html',
        controller: 'ValidationCtrl'
      });
  });