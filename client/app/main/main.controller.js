'use strict';

angular.module('svampeatlasApp')
  .controller('MainCtrl', function($scope, $http, $translate,  $mdMedia,  Observation, Locality, appConstants, $mdDialog, leafletData, $timeout, ObservationModalService, ObservationFormService, $state, $stateParams , Auth, User, $location, SearchService, $q, $cookies, $mdDateLocale, $rootScope, $mdSidenav) {
	 
	//  $scope.isChrome = (/Chrome/i.test(navigator.userAgent));
	  $scope.Auth = Auth;
	  $scope.$state = $state;
	  $scope.mdMedia = $mdMedia;
	  $scope.translate = $translate;
	  var that = this;
  	//$scope.preferred_language =  $cookies.get("preferred_language") || 'da';
	
		$rootScope.$broadcast('close_sidemenu');
		$scope.sideMenuClosed = true;
	
	 
	$scope.openSideMenu = function(){
		$rootScope.$broadcast('open_sidemenu');
		
			$scope.sideMenuClosed = false;
		
		
	};
	
	function setCalendarLanguage(){
		var localeDate = moment.localeData();

		$mdDateLocale.months = localeDate._months;
		$mdDateLocale.shortMonths = localeDate._monthsShort;
		$mdDateLocale.days = localeDate._weekdays;
		$mdDateLocale.shortDays = localeDate._weekdaysMin;

		$mdDateLocale.msgCalendar = $translate.instant('Kalender');
		$mdDateLocale.msgOpenCalendar = $translate.instant('Åbn kalender');
	}
	//$scope.preferred_language = $cookies.get('preferred_language') || 'da';
	function reloadWithLanguage(newval) {
		var pathname = location.pathname;
		            var localePrefix = newval == 'da' ? '' : '/' + newval;
		            if (pathname.indexOf('/en/') === 0) {
		                pathname = pathname.substr(3);
		            }
		            window.location.href = localePrefix + pathname + location.search + location.hash;
	}
	
	$scope.changeLanguage = function(newval){
		
		if(newval === 'dk'){
			 moment.locale('da');
		} else if(newval === 'en'){
			moment.locale('en');
		}
		setCalendarLanguage();
		if(Auth.isLoggedIn()){
			
			User.setLanguage({language: newval }).$promise.then(function(){
				$cookies.put("preferred_language",newval)
				reloadWithLanguage(newval)
			})
		} else {
			$cookies.put("preferred_language",newval)
			reloadWithLanguage(newval)
			//$translate.use(newval);
			// $rootScope.$broadcast("preferred_language_changed", newval)
			
		}
	/*	$timeout(function(){
			$scope.preferred_language = $cookies.get('preferred_language') || 'da';
		}) */
	}
	

	
	$timeout(function(){
		$scope.preferred_language = $cookies.get('preferred_language') || 'da';
	})
	  
	  $scope.$on("preferred_language_changed", function(evt, newval){
		  $scope.preferred_language = newval;
	  })
	  
	  
	  
	  
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
	  
	  if($stateParams.openLogin || $location.search().fberror){
	  
		  $scope.showLogin();
	
	  }
	
		
  })
  .filter('limitHtml', function() {
      return function(text, limit) {

          var changedString = String(text).replace(/<[^>]+>/gm, '');
          var length = changedString.length;

          return changedString.length > limit ? changedString.substr(0, limit - 1)+"..." : changedString; 
      }
  })
  .filter('localNumber', function ($cookies) {
	  			
	  
              return function (num, lang) {
                  if (angular.isUndefined(num)) return '';
				  var cookieLocale = $cookies.get('preferred_language');
				  var preferred_locale = (!cookieLocale || cookieLocale === 'dk')? 'da' : cookieLocale;
			  
                  return num.toLocaleString(preferred_locale);
              }
          });
