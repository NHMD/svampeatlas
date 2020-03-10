'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('imagevision', {
		parent: 'localization',  
		  
        url: '/imagevision',
		 title: 'Danmarks Svampeatlas', 
        templateUrl: 'app/imagevision/imagevision.html',
        controller: 'ImageVisionCtrl',
		  controllerAs: 'ctrl'
      });
  });