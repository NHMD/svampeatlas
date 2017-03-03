'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonmorphogroups', {
		  authenticate: function(Auth){
		  	return Auth.hasRole('taxonomyadmin')
		  },
        url: '/taxonbase/morphogroups',
        templateUrl: 'app/taxonmorphogroups/taxonmorphogroup.html',
        controller: 'TaxonMorphoGroupCtrl'
      });
  });