'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
		  params: {
		      openLogin: null,
			  fberror: null
		    },
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });
