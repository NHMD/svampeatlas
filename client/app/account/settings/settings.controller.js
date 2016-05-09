'use strict';

angular.module('svampeatlasApp')
  .controller('SettingsCtrl', function($scope, User, Auth, $window, $http, $mdMedia, $mdDialog, $mdToast, $translate) {
    $scope.errors = {};
	
	$scope.getCurrentUser = Auth.getCurrentUser;
	$scope.isLoggedIn = Auth.isLoggedIn;
	$scope.oldEmail = $scope.getCurrentUser().email;
	
	
	$scope.restoreEmail = function(){
		
		$scope.getCurrentUser().email = $scope.oldEmail;
		
		
	}
	
	$scope.saveEmail = function(){
		
		User.setEmail({email:$scope.getCurrentUser().email}).$promise.then(function(){
			return Auth.refreshUser();
		}).then(function(){
			$scope.oldEmail = $scope.getCurrentUser().email;
		})
		.catch(function(err){
			alert(err.message)
		})
		
	}
  
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider +'/authorize?access_token='+Auth.getToken();
    };
	
	$scope.disconnectOauth = function(provider) {
	  $http.delete('/auth/' + provider).
	    then(function(response) {
			if (provider === "facebook"){
				$scope.getCurrentUser().fb = false;
			}
	    }, function(response) {
	      // called asynchronously if an error occurs
	      // or server returns response with an error status.
	    });
      
    };
	
   
	
	$scope.showPwForm = function(ev){
		var useFullScreen = $mdMedia('xs');
		    $mdDialog.show({
		      controller: PwController,
		      templateUrl: 'app/account/settings/pw-modal.tpl.html',
		    //  parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: useFullScreen
		    })
			.then(function(status) {
				$mdToast.show(
				      $mdToast.simple()
				        .textContent(status)
				        .position('top right')
				        .hideDelay(3000)
				    );
			     
			    });
	   
		
	}
    
    
	
	
});	
	/******************************/
	
  
var PwController = ['$scope', 'Auth', '$state', '$window', '$location', '$cookies', '$translate', 'PlutoF', 'ssSideNav', '$mdDialog', '$mdMedia', function($scope, Auth, $state, $window, $location, $cookies, $translate, PlutoF, ssSideNav, $mdDialog, $mdMedia) {
    $scope.user = {};
    $scope.errors = {};
	$scope.$mdMedia = $mdMedia;
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
		  .then(function(){
		  	$mdDialog.hide($translate('Password successfully changed.'));
		  })
          .catch(function() {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };
	

  }]
  