'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonTabsCtrl', ['$scope',  '$state','$stateParams', 
		function($scope,  $state, $stateParams) {
			
			$scope.state = $state;
			
			$scope.tabs = [
			    { title:'Search taxa', state: 'taxonomy', active: 'taxonomy' === $state.current.name},
				{ title:'Taxon tree', state: 'taxonomy-tree', active: 'taxonomy-tree' === $state.current.name},
			    { title:'Add new taxon',  state: 'funindex' , active: 'funindex' === $state.current.name},
				{ title:'Taxon', state: 'taxonlayout-taxon' , active: 'taxonlayout-taxon' === $state.current.name, disabled: $state.current.name.split('-')[0] !== 'taxonlayout'},
				{ title:'Red List',  state: 'taxonlayout-taxonredlistdata' , active: 'taxonlayout-taxonredlistdata' === $state.current.name, disabled: $state.current.name.split('-')[0] !== 'taxonlayout'},
				{ title:'Book layout',  state: 'taxonlayout-taxonbooklayout' , active: 'taxonlayout-taxonbooklayout' === $state.current.name, disabled: $state.current.name.split('-')[0] !== 'taxonlayout'},
				{ title:'Log', state: 'taxonlog' , active: 'taxonlog' === $state.current.name}
			  ];
			  $scope.tabs.activeTab = $state.current.name;
			
			  $scope.$watch('tabs.activeTab', function(newState, oldState){
				  if(newState !== oldState){
  					if($state.current.name.split('-')[0] === 'taxonlayout'){
  						$state.go(newState, {id : $stateParams.id});
					
  					} else {
  						$state.go(newState);
  					}
				  }
			  })

			
		
		}
	])

