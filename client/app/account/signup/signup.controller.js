'use strict';

angular.module('svampeatlasApp')
  .controller('SignupCtrl', function($scope, Auth, $state, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
		  Initialer:  $scope.user.Initialer,
          password: $scope.user.password
        })
        .then(function() {
          // Account created, redirect to home
          $state.go('main');
        })
        .catch(function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the sequelize errors
          if (err.name) {
            angular.forEach(err.fields, function(value, field) {
              form[field].$setValidity('mongoose', false);
			  if(err.name === "SequelizeUniqueConstraintError"){
			  	$scope.errors[field] = field+" er optaget";
			  } else {
				  $scope.errors[field] = err.message;
			  }
            });
          }
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
