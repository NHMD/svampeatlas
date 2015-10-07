'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonlog', {
		  authenticate: function(Auth){
		  	return Auth.hasRole('taxonomyadmin')
		  },
        url: '/taxonbase/log',
        templateUrl: 'app/taxonlog/taxonlog.html',
        controller: 'TaxonLogCtrl'
      });
  });