'use strict';

angular.module('svampeatlasApp')
  .controller('NavbarMaterialCtrl', function ($scope, Auth, User, $state, $translate, $cookies, $mdBottomSheet,$mdSidenav, ssSideNav,ssSideNavSharedService,$rootScope, $mdDialog, $mdMedia) {
      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.hasRole = Auth.hasRole;
      $scope.getCurrentUser = Auth.getCurrentUser;
	  $scope.mdMedia = $mdMedia;
	  $scope.User = Auth.getCurrentUser();
	              $scope.menu = ssSideNav;
				

	              // Listen event SS_SIDENAV_CLICK_ITEM to close menu
	              $rootScope.$on('SS_SIDENAV_CLICK_ITEM', function() {
	                  $mdSidenav('left').close();
	              });

				  $scope.forceCloseSidenav = function(){
					 
					  $mdSidenav('left').close();
				
						$scope.menu.userHasForceClosed = true;
					
				  };
				  
	$scope.languages = [{"value":"dk","label":"<img src=\"assets/images/flags/flags/shiny/16/Denmark.png\" >"},{"value":"en","label":"<img src=\"assets/images/flags/flags/shiny/16/United-Kingdom.png\">"}];
	Auth.getCurrentUser(function(usr){
		
			
		
			$scope.preferred_language = (usr) ? usr.preferred_language : $cookies.get("preferred_language");
			if(Auth.hasRole('taxonomyadmin')){
				ssSideNav.setVisible('TaxonBase', true);
			}
			if(Auth.hasRole('useradmin')){
				ssSideNav.setVisible('UserAdmin', true);
			}
		
			if(!usr){
				ssSideNav.setVisible('Logout', false);
			}
		})
	
	
	
	$rootScope.$on('logged_in', function(ev, usr){
		$scope.User = usr;
	})
	
	$scope.preferred_language = $cookies.get('preferred_language') || 'dk';

	
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
	
	$scope.showLoginForm = function(ev){
		var useFullScreen = $mdMedia('xs');
		    $mdDialog.show({
		    //  controller: LoginController,
		      templateUrl: 'app/account/login/login-modal.tpl.html',
		    //  parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: useFullScreen
		    })
	
	}
    	
});	
