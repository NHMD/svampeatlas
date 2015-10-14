'use strict';

angular.module('svampeatlasApp')
  .controller('LoginCtrl', function($scope, Auth, $state, $window, $location, $cookies, PlutoF) {
    $scope.user = {};
    $scope.errors = {};
	
	
	$scope.fberror = $location.search().fberror;
	
    $scope.login = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          Initialer: $scope.user.Initialer,
          password: $scope.user.password
        })
        .then(function() {
			Auth.getCurrentUser(function(){
	    		  if(Auth.hasRole('taxonomyadmin') &&  !$cookies.get('plutoftoken')){
					  
					  PlutoF.GetToken().$promise.then(function(res){
	  	      			var exp = new Date();
	  	      			exp.setHours(exp.getHours() + (14* 24));
	  	    			  $cookies.put('plutoftoken', res.access_token, {expires: exp}); 
						
					  })
	      			
	    		  };
				
			})
  		 
		  
          $state.go('main');
        })
        .catch(function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
