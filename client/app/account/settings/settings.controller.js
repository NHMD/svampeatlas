'use strict';

angular.module('svampeatlasApp')
  .controller('SettingsCtrl', function($scope, User, Auth, $window, $http) {
    $scope.errors = {};
	
	$scope.getCurrentUser = Auth.getCurrentUser;
	
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
	
    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
          .then(function() {
            $scope.message = 'Password successfully changed.';
          })
          .catch(function() {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };
  });
