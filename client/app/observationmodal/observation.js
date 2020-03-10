'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider

      .state('observationform', {
		parent: 'localization',  
		  
		  authenticate: function(Auth){
		  	return Auth.isLoggedIn()
		  },
        url: '/observations/new',
        templateUrl: 'app/observationform/observationform.html',
		  title: 'Nyt fund',
       controller: 'ObservationFormCtrl',
		  controllerAs : 'ctrl'
      })
      .state('observations', {
		parent: 'localization',  
		  
        url: '/observations/:observationid?',
        templateUrl: 'app/observationmodal/observation.html',
        controller: 'ObservationCtrl',
		  controllerAs : 'ctrl'
      });
 
 });