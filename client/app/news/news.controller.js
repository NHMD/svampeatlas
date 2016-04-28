'use strict';

angular.module('svampeatlasApp')
  .controller('NewsCtrl',['$scope','$http', '$mdMedia', '$mdDialog',  function ($scope, $http, $mdMedia, $mdDialog) {
   
	  $scope.mdMedia = $mdMedia;
 	  $http.jsonp('http://svampeatlasnyheder.blogspot.com/feeds/posts/default?alt=json-in-script&callback=JSON_CALLBACK')
	      .success(function(data){
	          $scope.news = data.feed.entry;
	      });
	

	
	
	      $scope.showNews = function(ev, item) {
	      	var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
		
	      	$mdDialog.show({
	      		controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {
	  				$scope.item = item;
	  				$scope.cancel = function() {
	  				    $mdDialog.cancel();
	  				  };
    			
    			
	      		}],
	      		templateUrl: 'app/main/news.tpl.html',
	      		parent: angular.element(document.body),
	      		targetEvent: ev,
	      		clickOutsideToClose: true,
	      		fullscreen: useFullScreen
	      	})


	      	$scope.$watch(function() {
	      		return $mdMedia('xs') || $mdMedia('sm');
	      	}, function(wantsFullScreen) {
	      		$scope.customFullscreen = (wantsFullScreen === true);
	      	});
	      };


  }])
