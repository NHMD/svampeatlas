'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonlayout-taxonbooklayout', {
		  authenticate: function(Auth){
		  	return Auth.hasRole('taxonomyadmin')
		  },
        url: '/taxonbase/taxonbooklayout/:id',
        templateUrl: 'app/taxonbooklayout/taxonbooklayout.html',
        controller: 'TaxonBookLayoutCtrl'
      });
  });