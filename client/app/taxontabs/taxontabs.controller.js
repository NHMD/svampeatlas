'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonTabsCtrl', ['$scope',  '$state','$stateParams', 'Auth', '$translate', '$mdSidenav',
		function($scope,  $state, $stateParams, Auth, $translate, $mdSidenav) {
			$scope.hasRole = Auth.hasRole;
			$scope.state = $state;
			$scope.mdSidenav = $mdSidenav;
			$scope.toggleSidenav = function(nav){
				$mdSidenav(nav).toggle();
			};
	
			$scope.tabs = [

				{ title:'Taxon', state: 'taxonlayout-taxon'},
				{ title:'Red List',  state: 'taxonlayout-taxonredlistdata'},
				{ title:'Book layout',  state: 'taxonlayout-taxonbooklayout'}
			  ];
			  
  			$scope.states = 
  			    { 'taxonomy': 'Search taxa',
				'taxonomy-tree': 'Taxon tree',
				'funindex': 'Add new taxon',
				'taxonlayout-taxon': 'Taxon',
				'taxonlayout-taxonredlistdata': 'Red List',
				'taxonlayout-taxonbooklayout': 'Book layout',
				'taxonlog' : 'Log',
				'taxontags' : 'Tags'
			};
			
	
		  
		 
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
			 /*	  
		
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
			 
			 
*/
			
		
		}
	])

