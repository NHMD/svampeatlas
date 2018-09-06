  'use strict';

  angular.module('svampeatlasApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('taxon-tree-dk', {
          url: '/classification',
		title: 'Danmarks Svampe',
			
           templateUrl: 'app/view-dktree/view-dktree.html',
          controller: 'ViewDKTreeCtrl',
			controllerAs: "ctrl"
        });
    });
	
	
