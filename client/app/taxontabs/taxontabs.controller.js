'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonTabsCtrl', ['$scope',  '$state','$stateParams', 'Auth', '$translate',
		function($scope,  $state, $stateParams, Auth, $translate) {
			$scope.hasRole = Auth.hasRole;
			$scope.state = $state;
			
			$scope.tabs = [
			    { title:'Search taxa', state: 'taxonomy'},
				{ title:'Taxon tree', state: 'taxonomy-tree'},
			    { title:'Add new taxon',  state: 'funindex' },
				{ title:'Taxon', state: 'taxonlayout-taxon' },
				{ title:'Red List',  state: 'taxonlayout-taxonredlistdata' },
				{ title:'Book layout',  state: 'taxonlayout-taxonbooklayout'},
				{ title:'Log', state: 'taxonlog'},
				{ title:'Tags', state: 'taxontags'}
			  ];
		  
		 /*	  
		$scope.tabs.activeTab =	 _.indexOf( $scope.tabs, _.findWhere($scope.tabs, { 'state': $state.current.name }))
			
			  $scope.$watch('tabs.activeTab', function(newIdx, oldIdx){
				  if(newIdx !== -1 && newIdx !== oldIdx){
  					if($state.current.name.split('-')[0] === 'taxonlayout'){
  						$state.go($scope.tabs[newIdx].state, {id : $stateParams.id});
					
  					} else {
  						$state.go($scope.tabs[newIdx].state);
  					}
				  }
			  })
			 */
		
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

