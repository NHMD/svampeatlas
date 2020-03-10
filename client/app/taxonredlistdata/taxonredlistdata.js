'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonlayout-taxonredlistdata', {
		parent: 'localization',  
		  
		  authenticate: function(Auth){
		  	return Auth.hasRole('taxonomyadmin')
		  },
        url: '/taxonbase/taxonredlistdata/:id',
        templateUrl: 'app/taxonredlistdata/taxonredlistdata.html',
        controller: 'TaxonRedListDataCtrl',
		title: 'Danmarks Svampeatlas',
		  
      });
  });