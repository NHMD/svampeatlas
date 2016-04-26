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
		      controller: LoginController,
		      templateUrl: 'app/account/login/login-modal.tpl.html',
		    //  parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: useFullScreen
		    })
		    .then(function(answer) {
		      $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      $scope.status = 'You cancelled the dialog.';
		    });
			
		   
		
	}
    
    
	
	
});	
	/******************************/
	
  
var LoginController = ['$scope', 'Auth', '$state', '$window', '$location', '$cookies', '$translate', 'PlutoF', 'ssSideNav', '$mdDialog', '$mdMedia', function($scope, Auth, $state, $window, $location, $cookies, $translate, PlutoF, ssSideNav, $mdDialog, $mdMedia) {
    $scope.user = {};
    $scope.errors = {};
	$scope.$mdMedia = $mdMedia;
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.fberror = $location.search().fberror;
	
    $scope.login = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          Initialer: $scope.user.Initialer,
          password: $scope.user.password
        })
        .then(function() {
			Auth.getCurrentUser(function(usr){
				
				if(usr){
					ssSideNav.setVisible('Logout', true);
				}
				if(Auth.hasRole('taxonomyadmin')){
					ssSideNav.setVisible('TaxonBase', true);
				}
				if(Auth.hasRole('useradmin')){
					ssSideNav.setVisible('UserAdmin', true);
				}
				$cookies.put('preferred_language', usr.preferred_language);
				$translate.use(usr.preferred_language);
	    		  if(Auth.hasRole('taxonomyadmin') &&  !$cookies.get('plutoftoken')){
					  
					  PlutoF.GetToken().$promise.then(function(res){
	  	      			var exp = new Date();
	  	      			exp.setHours(exp.getHours() + (14* 24));
	  	    			  $cookies.put('plutoftoken', res.access_token, {expires: exp}); 
						
					  })
	      			
	    		  };
				
			})
  		 
		 $mdDialog.cancel();
		  
         // $state.go('main');
        })
        .catch(function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  }]
  

  
