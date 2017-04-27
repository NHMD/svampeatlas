'use strict';

angular.module('svampeatlasApp')
  .controller('ConfirmCtrl', function($scope, User, Auth, $stateParams, $cookies, $state, ErrorHandlingService, $mdDialog, $mdMedia, $translate ) {
	  $scope.pending = false;
	  if($stateParams.token){
		
		  $scope.User = User.getPending({token: $stateParams.token}).$promise.then(function(usr){
			  $scope.activationSuccess = true;
			  $scope.pending = false;
		  })
	  }  else {
		  
		  $scope.pending = false;
		   $scope.activationSuccess = false;
	  	
	  }
   
	  $scope.showLogin = function(){
  		var useFullScreen = $mdMedia('xs');
  		    $mdDialog.show({
  		      controller: 'LoginController',
				locals: {forgotPw : false, forgotPwEmail: ""},
  		      templateUrl: 'app/account/login/login-modal.tpl.html',
  		    //  parent: angular.element(document.body),
  		     // targetEvent: ev,
  		      clickOutsideToClose:true,
  		      fullscreen: useFullScreen
  		    })
	  }
	
});	
	/******************************/
	

  