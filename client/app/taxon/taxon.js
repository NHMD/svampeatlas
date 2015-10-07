'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonlayout-taxon', {
		  authenticate: function(Auth){
		  	return Auth.hasRole('taxonomyadmin')
		  },
        url: '/taxonbase/taxon/:id',
        templateUrl: 'app/taxon/taxon.html',
        controller: 'TaxonCtrl'
      });
  });