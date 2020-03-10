'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('validation', {
		parent: 'localization',  
		  
		  title: 'Kvalitetssikring af data', 
        url: '/validation',
        templateUrl: 'app/validation/validation.html',
        controller: 'ValidationCtrl'
      });
  });