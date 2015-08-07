'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonTabsCtrl', ['$scope',  '$state','$stateParams',
		function($scope,  $state, $stateParams) {
			
			$scope.state = $state;
			
			$scope.tabs = [
			    { title:'Search taxa', state: 'taxonomy', active: 'taxonomy' === $state.current.name},
			    { title:'Add new taxon',  state: 'funindex' , active: 'funindex' === $state.current.name},
				{ title:'Taxon', state: 'taxon' , active: 'taxon' === $state.current.name, disabled: !($state.current.name === 'taxonredlistdata' || $state.current.name === 'taxon')},
				{ title:'Red List',  state: 'taxonredlistdata' , active: 'taxonredlistdata' === $state.current.name, disabled: !($state.current.name === 'taxonredlistdata' || $state.current.name === 'taxon')},
				{ title:'Log', state: 'taxonlog' , active: 'taxonlog' === $state.current.name}
			  ];
			
			  
			
			$scope.selectTab = function(tab){
				
				console.log($state.current)
				
				if($state.current.name === 'taxonredlistdata' || $state.current.name === 'taxon'){
					$state.go(tab.state, $stateParams);
					
				} else {
					$state.go(tab.state);
				}
				
				
				
			}
			
		
		}
	])

