'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonomy', {
		parent: 'localization',  
		  
		  authenticate: function(Auth){
		  	return Auth.hasRole('taxonomyadmin')
		  },
        url: '/taxonbase/search',
        templateUrl: 'app/taxonomy/taxonomy.html',
        controller: 'TaxonomyCtrl',
		title: 'Danmarks Svampeatlas',
		  
      });
  });