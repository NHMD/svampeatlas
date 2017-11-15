'use strict';

angular.module('svampeatlasApp')
	.controller('SearchTabsCtrl', ['$scope',  '$state','$stateParams', 'Auth', '$translate', '$mdMedia',
		function($scope,  $state, $stateParams, Auth, $translate, $mdMedia) {
			$scope.mdMedia = $mdMedia;
			$scope.hasRole = Auth.hasRole;
			$scope.state = $state;
			$scope.currentUser = Auth.getCurrentUser();

	
			$scope.tabs = [

				{ title:'Søgeformular', state: 'search', icon: 'search'},
				{ title:'Resultat i liste',  state: 'search-list', icon: 'list'},
				{ title:'Galleri',  state: 'search-gallery', icon: 'view_comfy'},
				{ title:'Resultat på kort',  state: 'search-map', icon: 'map'},
				{ title:'Artsliste',  state: 'search-specieslist', icon: 'fungus'}
			  ];
			  
  			$scope.states = 
  			    { 'search': 'Søgeformular',
				'search-list': 'Resultat i liste',
			  'search-gallery': 'Galleri',
				'search-map': 'Resultat på kort',
			  'search-specieslist' : 'Artsliste'
			};
			
	
		  
		 
		$scope.tabs.activeTab =	 _.indexOf( $scope.tabs, _.findWhere($scope.tabs, { 'state': $state.current.name }))
			
			  $scope.$watch('tabs.activeTab', function(newIdx, oldIdx){
				  if(newIdx !== -1 && newIdx !== oldIdx){
  					if($stateParams.searchid){
  						$state.go($scope.tabs[newIdx].state, {searchid : $stateParams.searchid});
					
  					} else {
  						$state.go($scope.tabs[newIdx].state);
  					}
				  }
			  })

		
		}
	])

