'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonTabsCtrl', ['$scope',  '$state',
		function($scope,  $state) {
			
			$scope.state = $state;
			
			$scope.tabs = [
			    { title:'Search taxa', state: 'taxonomy', active: 'taxonomy' === $state.current.name},
			    { title:'Add new taxon',  state: 'funindex' , active: 'funindex' === $state.current.name},
				{ title:'Taxon', state: 'taxon' , active: 'taxon' === $state.current.name}
			  ];
			
			  
			
			$scope.selectTab = function(tab){
				
				$state.go(tab.state);
				
			}
			
		
		}
	])

