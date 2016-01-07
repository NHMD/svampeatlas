'use strict';

angular.module('svampeatlasApp')
	.controller('SearchTabsCtrl', ['$scope',  '$state','$stateParams', 'Auth', '$translate', '$mdSidenav','$mdMedia','ssSideNav',
		function($scope,  $state, $stateParams, Auth, $translate, $mdSidenav, $mdMedia,ssSideNav) {
			$scope.hasRole = Auth.hasRole;
			$scope.state = $state;
			$scope.mdSidenav = $mdSidenav;
			$scope.menu = ssSideNav;
			$scope.openSideNav = function(){
			
					$scope.menu.userHasForceClosed = false;
			
				 $mdSidenav('left').open();
			}
	
			$scope.tabs = [

				{ title:'Søgeformular', state: 'search'},
				{ title:'Resultat i liste',  state: 'search-list'},
				{ title:'Resultat på kort',  state: 'search-map'}
			  ];
			  
  			$scope.states = 
  			    { 'search': 'Søgeformular',
				'search-list': 'Resultat i liste',
				'search-map': 'Resultat på kort'
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

