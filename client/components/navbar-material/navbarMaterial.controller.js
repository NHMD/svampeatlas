'use strict';

angular.module('svampeatlasApp')
  .controller('NavbarMaterialCtrl', function ($scope, $timeout, Auth, User, $state, $translate,$mdDateLocale, $cookies, $mdBottomSheet,$mdSidenav, ssSideNav,ssSideNavSharedService,$rootScope, $mdDialog, $mdMedia, $window) {
      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.hasRole = Auth.hasRole;
      $scope.getCurrentUser = Auth.getCurrentUser;
	  $scope.mdMedia = $mdMedia;
	  var that = this;
	  this.$state = $state;
	 $scope.User = Auth.getCurrentUser();
	  
	 
	              $scope.menu = ssSideNav;

	              // Listen event SS_SIDENAV_CLICK_ITEM to close menu
	              $rootScope.$on('SS_SIDENAV_CLICK_ITEM', function() {
	                  $mdSidenav('left').close();
	              });

				  $scope.forceCloseSidenav = function(){
					 that.closed = true;
					  $mdSidenav('left').close();
					  
					//	$scope.menu.userHasForceClosed = true;
					
				  };
				  
	Auth.getCurrentUser(function(usr){
		
			
		
			$scope.preferred_language = (usr) ? usr.preferred_language : $cookies.get("preferred_language");
			if(Auth.hasRole('taxonomyadmin')){
				ssSideNav.setVisible('TaxonBase', true);
			}
			if(Auth.hasRole('useradmin')){
				ssSideNav.setVisible('UserAdmin', true);
			}
		
			if(!usr){
				ssSideNav.setVisible('Logout', false);
			}
		})
		$rootScope.$on('open_sidemenu', function(){
			that.closed = false;
		})
		$rootScope.$on('close_sidemenu', function(){
			that.closed = true;
		})
	$rootScope.$on('userHasOpenedMenu', function(){
		that.closed = false;
	})
	$rootScope.$on('logged_in', function(ev, usr){
		$scope.User = usr;
	})
	
	

	function setCalendarLanguage(){
		var localeDate = moment.localeData();

		$mdDateLocale.months = localeDate._months;
		$mdDateLocale.shortMonths = localeDate._monthsShort;
		$mdDateLocale.days = localeDate._weekdays;
		$mdDateLocale.shortDays = localeDate._weekdaysMin;

		$mdDateLocale.msgCalendar = $translate.instant('Kalender');
		$mdDateLocale.msgOpenCalendar = $translate.instant('Åbn kalender');
	}
	
	
	
	$scope.preferred_language = $cookies.get('preferred_language') || 'da';
	$scope.changeLanguage = function(newval){
		
		if(newval === 'dk'){
			 moment.locale('da');
		} else if(newval === 'en'){
			moment.locale('en');
		}
		setCalendarLanguage();
		if(Auth.isLoggedIn()){
			
			User.setLanguage({language: newval }).$promise.then(function(){
				$scope.getCurrentUser().preferred_language = newval;
				$cookies.put("preferred_language",newval)
				$translate.use(newval);
			})
		} else {
			$cookies.put("preferred_language",newval)
			$translate.use(newval);
			$rootScope.$broadcast("preferred_language_changed", newval)
			
		}
		$timeout(function(){
			$scope.preferred_language = $cookies.get('preferred_language') || 'da';
		})
	}
	
  $scope.$on("preferred_language_changed", function(evt, newval){
	  $scope.preferred_language = newval;
  })
	

	
	$scope.sendNewUserRequestByEmail = function(){
		
		
		    $window.open("mailto:svampejagt@svampe.dk"+  "?subject=" +"Brugeroprettelse på svampeatlas"+"&body="+"Jeg vil gerne oprettes som bruger på Danmarks svampeatlas, mit fulde navn er: ","_self");
		
	}
	$scope.showLoginForm = function(ev){
		var useFullScreen = $mdMedia('xs');
		    $mdDialog.show({
		    controller: 'LoginController',
				locals: {forgotPw : false, forgotPwEmail: ""},
		      templateUrl: 'app/account/login/login-modal.tpl.html',
		    //  parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: useFullScreen
		    })
	
	}
    	
});	
