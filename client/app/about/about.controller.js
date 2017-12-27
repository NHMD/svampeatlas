'use strict';

angular.module('svampeatlasApp')
  .controller('AboutCtrl',['$scope', '$rootScope','appConstants', '$cookies', function ($scope, $rootScope, appConstants, $cookies) {
   
	$rootScope.$broadcast('open_sidemenu');
   	
  
  $scope.templateUrl= function(){
  	
	return '/api/content/'+$cookies.get('preferred_language')+'/about.html'
  }
 


  }])
