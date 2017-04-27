'use strict';

angular.module('svampeatlasApp')
  .controller('ForgotCtrl', function($scope, User, Auth, $stateParams, $cookies, $state, ErrorHandlingService ) {
	  
	  if($stateParams.token){
		var exp = new Date();
		exp.setHours(exp.getHours() + 1);
		$cookies.put('token', $stateParams.token, {
			expires: exp
		});
		$scope.User = User.get()
	  }  
   
//	$scope.oldEmail = $scope.getCurrentUser().email;
	

	
	$scope.resetPassword = function(){
		
		Auth.resetPassword($scope.User, $scope.newPass)
		.then(function(){
			Auth.logout();
			$state.go('main', {openLogin: true})
		})
		.catch(function(err){
			ErrorHandlingService.handle500();
			
		})
		
	}
  

    
    
	
	
});	
	/******************************/
	

  