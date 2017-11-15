'use strict';

angular.module('svampeatlasApp')
	.controller('SpeciesSearchTabsCtrl', ['$scope',  '$state','$stateParams', 'Auth', '$translate', '$mdMedia',
		function($scope,  $state, $stateParams, Auth, $translate, $mdMedia) {
			$scope.mdMedia = $mdMedia;
			$scope.hasRole = Auth.hasRole;
			$scope.state = $state;
			$scope.currentUser = Auth.getCurrentUser();

	
			$scope.tabs = [

				{ title:'Søgeformular', state: 'checklist', icon: 'search'},
				
				{ title:'Galleri',  state: 'checklist-gallery', icon: 'view_comfy'}
			  ];
			  
  			$scope.states = 
  			    { 'checklist': 'Søgeformular',
				
			  'checklist-gallery': 'Galleri'
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

