'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider

      .state('observationform', {
	
        url: '/observations/new',
        templateUrl: 'app/observationform/observationform.html',
        controller: 'ObservationFormCtrl'
      })
      .state('observations', {
	
        url: '/observations/:observationid?',
        templateUrl: 'app/observationmodal/observation.html',
        controller: 'ObservationCtrl'
      });
 
 });