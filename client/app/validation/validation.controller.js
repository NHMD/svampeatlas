'use strict';

angular.module('svampeatlasApp')
  .controller('ValidationCtrl',['$scope', 'appConstants','$cookies','$rootScope', function ($scope, appConstants, $cookies, $rootScope) {
   	
		$rootScope.$broadcast('open_sidemenu');
		
	  $scope.templateUrl= function(){
	  	
		return '/api/content/'+$cookies.get('preferred_language')+'/validation.html'
	  }
	  $scope.appConstants = appConstants;


  }])
