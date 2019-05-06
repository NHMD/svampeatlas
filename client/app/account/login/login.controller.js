'use strict';

angular.module('svampeatlasApp')
  .controller('LoginController',  function($scope, Auth, $state, $window, $location, $cookies, $translate, PlutoF, ssSideNav, $mdDialog, $mdMedia, ErrorHandlingService, forgotPw, forgotPwEmail, $rootScope) {
    $scope.user = {};
    $scope.errors = {};
	$scope.$mdMedia = $mdMedia;
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.fberror = $location.search().fberror;
	$scope.forgotPw = (forgotPw) ? true : false;
	if(forgotPwEmail){
		$scope.forgotPwEmail = forgotPwEmail;
	}
    $scope.login = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          Initialer: $scope.user.Initialer,
          password: $scope.user.password
        })
        .then(function() {
			Auth.getCurrentUser(function(usr){
				$location.search('fberror', null)
				if(usr){
					ssSideNav.setVisible('Logout', true);
					$rootScope.$broadcast('open_sidemenu');
				}
				if(Auth.hasRole('taxonomyadmin')){
					ssSideNav.setVisible('TaxonBase', true);
				}
				if(Auth.hasRole('useradmin')){
					ssSideNav.setVisible('UserAdmin', true);
				}
				$cookies.put('preferred_language', usr.preferred_language);
				$translate.use(usr.preferred_language);
	    		 
				/*  if(Auth.hasRole('taxonomyadmin') &&  !$cookies.get('plutoftoken')){
					  
					  PlutoF.GetToken().$promise
					  .then(function(res){
	  	      			var exp = new Date();
	  	      			exp.setHours(exp.getHours() + (14* 24));
	  	    			  $cookies.put('plutoftoken', res.access_token, {expires: exp}); 
						
					  })
					  .catch(function(err){
						  console.log(err)
						  // ingnore
					  	
					  })
					  
	      			
	    		  }; */
				
			})
  		 
		 $mdDialog.cancel();
		  
          $state.go('dashboard');
        })
        .catch(function(err) {
          $scope.errors.other = 'Forkert password og/eller initialer.';
        });
      }
    };
	
	$scope.sendForgotPwMail = function(){
		
		Auth.forgot($scope.forgotPwEmail)
		.then(function(){
			$scope.forgotResponse = $translate.instant("Der er sendt en email til")+" "+$scope.forgotPwEmail+"."
			$scope.forgotPw = false;
		})
		.catch(function(err){
			if(err.status === 404){
				$scope.forgotError = $translate.instant("Emailen findes ikke i systemet")+".";
			}
			else {
				ErrorHandlingService.handle500();
			}
		})
	}

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
  

  
