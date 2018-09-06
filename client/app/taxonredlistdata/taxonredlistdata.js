'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxonlayout-taxonredlistdata', {
		  authenticate: function(Auth){
		  	return Auth.hasRole('taxonomyadmin')
		  },
        url: '/taxonbase/taxonredlistdata/:id',
        templateUrl: 'app/taxonredlistdata/taxonredlistdata.html',
        controller: 'TaxonRedListDataCtrl',
		title: 'Danmarks Svampeatlas',
		  
      });
  });