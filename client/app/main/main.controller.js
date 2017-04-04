'use strict';

angular.module('svampeatlasApp')
  .controller('MainCtrl', function($scope, $http, $translate, ssSideNav, $mdMedia, $mdSidenav, Observation, Locality, appConstants, $mdDialog, leafletData, $timeout, ObservationModalService, ObservationFormService, $state, $stateParams , Auth, $location, preloader) {
	 
	//  $scope.isChrome = (/Chrome/i.test(navigator.userAgent));
	  $scope.Auth = Auth;
	  $scope.$state = $state;
	  $scope.ObservationFormService = ObservationFormService;
	  $scope.translate = $translate;
	  var useLichenFilter = Boolean(localStorage.getItem('use_lichen_filter'));
	  
	  $scope.showLogin = function(){
  		var useFullScreen = $mdMedia('xs');
  		    $mdDialog.show({
  		    //  controller: LoginController,
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
	  
	  
	$scope.getBackgroundStyle = function(tile){
		
		var url = appConstants.imageurl + tile.Images[0].name + ".JPG";
		

		
	    return {'background-image':  'url('+url+')', 'background-size': 'cover'};
	}
	  
	  
	  $scope.openMenu = function($mdOpenMenu, ev) {
     
      $mdOpenMenu(ev);
    };
	  $scope.mdMedia = $mdMedia;
	  $scope.mdSidenav = $mdSidenav;
	  $scope.ObservationModalService = ObservationModalService;
	  $scope.menu = ssSideNav;
	  $scope.menu.userHasForceClosed = true;
	
	$scope.openSideNav = function(){
	
			$scope.menu.userHasForceClosed = false;
	
		 $mdSidenav('left').open();
	}
	
	$scope.positionRadius = 500;
	$scope.redListOnly = false;
	$scope.timePeriod = 'all';
	$scope.locateAndGoToSpeciesList = function() {
		//determinationViewWhere
		
		$scope.geoLocationStatusMessage = $translate.instant("Bestemmer din position ...");
		
			navigator.geolocation.getCurrentPosition(function(position) {
				
				
				var bounds = L.circle(L.latLng(position.coords.latitude, position.coords.longitude), $scope.positionRadius).getBounds();

				var  where = {};
				var geometry = L.polygon([bounds.getSouthWest(), bounds.getNorthWest(), bounds.getNorthEast(), bounds.getSouthEast(), bounds.getSouthWest()]).toGeoJSON();
				
				if($scope.timePeriod !== 'all'){
					where.observationDate = {};
					where.observationDate.$gt = ($scope.timePeriod === "year") ? moment().startOf('year') : moment().subtract(2, 'weeks');
				}
				
				var params = {where: where, geometry: geometry};
				if($scope.redListOnly === true){
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
	
	
	
	$scope.mapsettings = {
		defaults: {
			attributionControl: false
		},
		center: {
			lat: 56,
			lng: 11,
			zoom: 6
		},
		markers: {

		},
		
		layers: {
			baselayers: {
				osm: {
					name: 'OpenStreetMap',
					url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					type: 'xyz'
				}
			}
		}
	};
	
	
	
	$scope.latestlocalitydays = 3;
	
	$scope.$on('leafletDirectiveMarker.frontpagemap.click', function(e, args) {
		
		$state.go('search-list', {locality_id: args.model._id, date: moment().subtract($scope.latestlocalitydays, 'days').toString()})
	})
	
	
	$scope.getLatestLocalities = function(days){
		if(!days){
			days = $scope.latestlocalitydays;
		} else {
			$scope.latestlocalitydays = days;
		}
		
		var locQuery = {days: days};
		if(useLichenFilter){
			locQuery.lichensonly = true;
		}
		
	 return	Locality.recent(locQuery).$promise.then(function(localities){
		 $scope.mapsettings.markers = {};
			for (var i = 0; i < localities.length; i++) {
				$scope.mapsettings.markers[localities[i].name] = {
					lat: localities[i].decimalLatitude,
					lng: localities[i].decimalLongitude,
					_id: localities[i]._id,
				
					name: localities[i].name,
				
					icon: {
						type: 'awesomeMarker',
						prefix: 'fa',
						icon: 'circle',
						markerColor: 'blue'
					}

				};
			
			}
		
		}).then(function(){
			leafletData.getMap('frontpagemap').then(function(map) {
				map.zoomControl.setPosition('topright');
			
				$timeout(function() {
					map.invalidateSize();
				}, 11);
			});
		});
	}
	$scope.getLatestLocalities();

	
	
	
	$scope.getDate = function(observationDate, observationDateAccuracy){
		
		var splitted = observationDate.split(" ")[0].split("-");
		
		if(observationDateAccuracy === 'month'){
			//console.log("spl "+parseInt(splitted[1]))
			return moment.months()[parseInt(splitted[1])-1] +" "+splitted[0];
		} else if(observationDateAccuracy === 'year'){
			return splitted[0];
		} else if(observationDateAccuracy === 'invalid'){
			return "ingen dato"
		}
		
	}
	
	
	
	var determinationwhere = (useLichenFilter) ?	{
						lichenized: 1,
						$or: [{Determination_validation: 'Godkendt'} , {Determination_score: {$gte: 80}}]
					} : {
						Taxon_redlist_status: ['RE', 'CR', 'EN', 'VU', 'NT'],
						$or: [{Determination_validation: 'Godkendt'} , {Determination_score: {$gte: 80}}]
					};
		
		
	var query = {
		nocount: true,
		_order: JSON.stringify([
					['observationDate', 'DESC'],
					['_id', 'DESC']
				]),
		limit: 24,
		
		include: JSON.stringify(
			[
				JSON.stringify({
					model: "DeterminationView",
					as: "DeterminationView",
					where: determinationwhere,
					required: true
				}),
				JSON.stringify({
					model: "ObservationImage",
					as: 'Images',
					required: true

				}), 
				JSON.stringify({
					model: "User",
					as: 'PrimaryUser',
					attributes: ['_id','email', 'Initialer', 'name'],
					where: {},
					required: true
				}),
				JSON.stringify({
					model: "Locality",
					as: 'Locality',
					where: {},
					required: true
				}),
			]
		)
		
	};	
	
//	if(!useLichenFilter) {
	//	query.cachekey = 'latestredlisted';
//	};
	

					
	Observation.query(query).$promise.then(function(observations) {
		
		$scope.tiles = _.filter(observations, function(u) {
			return u.Images.length > 0;
		});
		
		preloader.preloadImages( $scope.tiles);
	})

	
$http.jsonp('https://svampeatlasnyheder.blogspot.com/feeds/posts/default?alt=json-in-script&callback=JSON_CALLBACK')
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
	
	
	
   /*
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
	*/
  })
  .filter('limitHtml', function() {
      return function(text, limit) {

          var changedString = String(text).replace(/<[^>]+>/gm, '');
          var length = changedString.length;

          return changedString.length > limit ? changedString.substr(0, limit - 1)+"..." : changedString; 
      }
  });
