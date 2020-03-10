'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonmorphogroupusers', {
		parent: 'localization',  
		  
		  authenticate: function(Auth){
		  	return Auth.hasRole('taxonomyadmin')
		  },
        url: '/taxonbase/morphogroups/:id',
        templateUrl: 'app/taxonmorphogroupusers/taxonmorphogroupuser.html',
		title: 'Danmarks Svampeatlas',
		  
        controller: 'TaxonMorphoGroupUserCtrl',
		  controllerAs: 'vm'
      });
  });