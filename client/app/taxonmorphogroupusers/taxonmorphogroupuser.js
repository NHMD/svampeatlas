'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonmorphogroupusers', {
		  authenticate: function(Auth){
		  	return Auth.hasRole('taxonomyadmin')
		  },
        url: '/taxonbase/morphogroups/:id',
        templateUrl: 'app/taxonmorphogroupusers/taxonmorphogroupuser.html',
        controller: 'TaxonMorphoGroupUserCtrl',
		  controllerAs: 'vm'
      });
  });