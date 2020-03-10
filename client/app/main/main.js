'use strict';

angular.module('svampeatlasApp')
  .config(function($stateProvider) {
    $stateProvider
        .state('localization', { // http://stackoverflow.com/questions/32357615/option-url-path-ui-router
            url: '/{locale:(?:en|da)}',
            abstract: true,
            template: '<div layout="column" ui-view  layout-fill role="main" flex >',
       
			
            params: {locale: {squash: true, value: 'da'}}
        })
      .state('main', {
		parent: 'localization',  
		  
		  params: {
		      openLogin: null,
			  fberror: null
		    },
        url: '/',
		 title: 'Danmarks Svampeatlas', 
			
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
			controllerAs: 'Main'	
      });
  });
