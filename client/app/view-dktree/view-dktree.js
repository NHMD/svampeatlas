  'use strict';

  angular.module('svampeatlasApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('taxon-tree-dk', {
		parent: 'localization',  
			
          url: '/classification',
		title: 'Danmarks Svampe',
			
           templateUrl: 'app/view-dktree/view-dktree.html',
          controller: 'ViewDKTreeCtrl',
			controllerAs: "ctrl"
        });
    });
	
	
