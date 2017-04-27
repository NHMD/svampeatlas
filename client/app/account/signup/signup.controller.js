'use strict';

angular.module('svampeatlasApp')
  .controller('SignupCtrl', function($scope, Auth, $state, $window, User, $mdMedia, $mdDialog, ErrorHandlingService) {
    $scope.user = {};
    $scope.errors = {};
	
  $scope.showLogin = function(){
		var useFullScreen = $mdMedia('xs');
		    $mdDialog.show({
		      controller: 'LoginController',
				locals: {forgotPw : true, forgotPwEmail: $("input[name='email']").val()},
				
		      templateUrl: 'app/account/login/login-modal.tpl.html',
		    //  parent: angular.element(document.body),
		     // targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: useFullScreen
		    })
  };

    $scope.register = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.createPendingUser({
          name: $scope.user.name,
          email: $scope.user.email,
		  Initialer:  $scope.user.Initialer,
          password: $scope.user.password
        })
        .then(function() {
          // Account created, redirect to home
         // $state.go('main');
		 $scope.registrationSuccess = true;
        })
        .catch(function(err) {
        	ErrorHandlingService.handle500();
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  })
  .directive('initials', function(User, $q) {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {

        ctrl.$asyncValidators.uniqueInitials = function(modelValue, viewValue) {

          if (ctrl.$isEmpty(modelValue)) {
            // consider empty model valid
            return $q.resolve();
          }

          var def = $q.defer();
		
			
		 
		  User.validateInitials({Initialer: modelValue}).$promise
		.then(function(res){
			if(res.count > 0){
				 def.reject();
			} else {
				 def.resolve()
				
			}
		})
		
		 return def.promise;


        };
      }
    };
  })
  .directive('uniqueEmail', function(User, $q) {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {

        ctrl.$asyncValidators.uniqueEmail = function(modelValue, viewValue) {

          if (ctrl.$isEmpty(modelValue)) {
            // consider empty model valid
            return $q.resolve();
          }

          var def = $q.defer();
		
			
		 
		  User.validateEmail({email: modelValue}).$promise
		.then(function(res){
			if(res.count > 0){
				 def.reject();
			} else {
				 def.resolve()
				
			}
		})
		
		 return def.promise;


        };
      }
    };
  })
