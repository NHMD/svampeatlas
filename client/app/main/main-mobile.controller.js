'use strict';

angular.module('svampeatlasApp')
  .controller('MainMobileCtrl', function($scope,  $translate,  $mdMedia, $timeout,  $state, $stateParams , Auth, $location,  SearchService, $q, appConstants) {
	 
	//  $scope.isChrome = (/Chrome/i.test(navigator.userAgent));
	  $scope.Auth = Auth;
	  $scope.$state = $state;
	  
	  $scope.translate = $translate;
	 
	
	  var that = this;
	
	$scope.openSideMenu = function(){
		$rootScope.$broadcast('open_sidemenu');
	};
	
	var frontPageImages = ['NetstokketIndigoroerhat.jpg', 'BomuldsSloerhat.jpg', 'koralpigsvamp.jpg', 'RoedFluesvamp.jpg', 'SejTraadkoelle.jpg' ]
	var randImg = frontPageImages[Math.floor(Math.random() * frontPageImages.length)];
	$scope.getHeaderImgBackgroundStyle = function(img){
		
		
		//var randImg ='koralpigsvamp.jpg';
		var url = appConstants.baseurl+appConstants.thumborUrl+"600x200/"
		
		+appConstants.baseurl+appConstants.imageurl +"mainpage/"+randImg;
		

		return {'background-image':  'url('+url+')', 'background-size': 'cover'};
	}
  $scope.openMenu = function($mdOpenMenu, ev) {
   
    $mdOpenMenu(ev);
  };
  this.positionRadius = 500;
  	this.redListOnly = false;
  	this.timePeriod = 'all';
	this.locateAndGoToSpeciesList = function() {
		//determinationViewWhere
		
		$scope.geoLocationStatusMessage = $translate.instant("Bestemmer din position ...");
		
			navigator.geolocation.getCurrentPosition(function(position) {
				
				
				var bounds = L.circle(L.latLng(position.coords.latitude, position.coords.longitude), that.positionRadius).getBounds();

				var  where = {};
				var geometry = L.polygon([bounds.getSouthWest(), bounds.getNorthWest(), bounds.getNorthEast(), bounds.getSouthEast(), bounds.getSouthWest()]).toGeoJSON();
				
				if(that.timePeriod !== 'all'){
					where.observationDate = {};
					where.observationDate.$gt = ($scope.timePeriod === "year") ? moment().startOf('year') : moment().subtract(2, 'weeks');
				}
				
				var params = {where: where, geometry: geometry};
				if(that.redListOnly === true){
					params.determinationViewWhere = {Taxon_redlist_status : ['RE','CR', 'EN', 'VU', 'NT']}
				}
				$scope.geoLocationStatusMessage = "";
				$state.go('search-specieslist', params)
		
			}, function(error) {
				
				switch (error.code) {
					case error.PERMISSION_DENIED:
						if(error.message.indexOf("Only secure origins are allowed") === 0) {
						      // Secure Origin issue.
							$scope.geoLocationStatusMessage = $translate.instant("Chrome browseren tillader ikke brug af position fra ikke-krypterede sider. Anvend i stedet")+" <a href='https://play.google.com/store/apps/details?id=org.mozilla.firefox'>Firefox</a> "+$translate.instant("eller")+" <a href='https://play.google.com/store/apps/details?id=com.opera.browser'>Opera</a>";
						    } else {
						    	$scope.geoLocationStatusMessage = $translate.instant("Du skal give enheden lov til at bruge din position.")
						    }
						
						break;
					case error.POSITION_UNAVAILABLE:
						$scope.geoLocationStatusMessage = $translate.instant("Positionsinformation er ikke tilgængelig.")
						break;
					case error.TIMEOUT:
						$scope.geoLocationStatusMessage = $translate.instant("Time out i bestemmelse af position.")
						break;
					case error.UNKNOWN_ERROR:
						$scope.geoLocationStatusMessage = $translate.instant("Der opstod en ukendt fejl med betemmelse af position.")
						break;
				}
			},{timeout: 30000, enableHighAccuracy: true})
		

	}

		
  })
