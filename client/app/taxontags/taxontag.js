'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxontags', {
		parent: 'localization',  
		  
		  authenticate: function(Auth){
		  	return Auth.hasRole('taxonomyadmin')
		  },
        url: '/taxonbase/tags',
        templateUrl: 'app/taxontags/taxontag.html',
        controller: 'TaxonTagCtrl',
		title: 'Danmarks Svampeatlas',
		  
      });
  });