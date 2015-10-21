'use strict';

angular.module('svampeatlasApp')
  .controller('NavbarCtrl', function ($scope, Auth, User, $state, $translate, $cookies) {
    $scope.menu = [{
      'title': 'Home',
      'state': 'main'
    }];
	
	$scope.isTaxonBase = function(){
		var TaxonBaseStates = ['taxonomy','funindex', 'taxonomy-tree','taxonlayout-taxon', 'taxonlayout-taxonredlistdata', 'taxonlayout-taxonbooklayout', 'taxonlog'  ];
		
		return (_.find(TaxonBaseStates, function(s){
			return s === $state.current.name;
		})) ? "active" : "";
		
	}
	
	$scope.languages = [{"value":"dk","label":"<img src=\"assets/images/flags/flags/shiny/16/Denmark.png\" >"},{"value":"en","label":"<img src=\"assets/images/flags/flags/shiny/16/United-Kingdom.png\">"}];
	
	Auth.getCurrentUser(function(usr){
		
		$scope.preferred_language = (usr) ? usr.preferred_language : $cookies.get("preferred_language");
	})
	
	
	$scope.$watch('preferred_language', function(newval, oldval){
		if(newval !== oldval){
			if(Auth.isLoggedIn()){
				
				User.setLanguage({language: newval }).$promise.then(function(){
					$scope.getCurrentUser().preferred_language = newval;
					$cookies.put("preferred_language",newval)
					$translate.use(newval);
				})
			} else {
				$cookies.put("preferred_language",newval)
				$translate.use(newval);
			}
			
			
		}
	});
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.hasRole = Auth.hasRole;
    $scope.getCurrentUser = Auth.getCurrentUser;
  });
