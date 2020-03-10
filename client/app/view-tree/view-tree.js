  'use strict';

  angular.module('svampeatlasApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('taxonomy-tree', {
		parent: 'localization',  
			
          url: '/taxonbase/taxonomy-tree',
           templateUrl: 'app/view-tree/view-tree.html',
          controller: 'ViewTreeCtrl',
		title: 'Danmarks Svampeatlas',
			
        });
    });
	
	
