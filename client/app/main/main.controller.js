'use strict';

angular.module('svampeatlasApp')
  .controller('MainCtrl', function($scope, $http, $translate, ssSideNav, $mdMedia, $mdSidenav, Observation, appConstants, $mdDialog ) {
	 

	  $scope.mdMedia = $mdMedia;
	  $scope.mdSidenav = $mdSidenav;
	 
	  $scope.menu = ssSideNav;
	  $scope.menu.userHasForceClosed = true;
	
	$scope.openSideNav = function(){
	
			$scope.menu.userHasForceClosed = false;
	
		 $mdSidenav('left').open();
	}
	$scope.loaded = {};
	$scope.failed = {};
	$scope.imageHasLoaded = function(img){
		$scope.loaded[img] = true;
		
	};
	$scope.imageHasFailed = function(img){
		$scope.failed[img] = true;
		
	};
	$scope.getImageUrl = function(tile){
		if(moment(tile.observationDate).year() < 2015){
			return appConstants.imageurl+tile.Images[0].name +".JPG";
		} else {
			return "http://svampe.dk/atlas/uploads/"+tile.Images[0].name +".JPG";
		}
	}
	
	
	
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
					
	Observation.query({
		order: 'observationDate DESC',
		limit: 50,
		include: JSON.stringify(
			[
				JSON.stringify({
					model: "DeterminationView",
					as: "DeterminationView",
					where: {
						Taxon_redlist_status: ['RE', 'CR', 'EN', 'VU', 'NT'],
						Determination_validation: 'Godkendt'
					}
				}),
				JSON.stringify({
					model: "ObservationImage",
					as: 'Images',
					offset: 0,
					limit: 1

				}), 
				JSON.stringify({
					model: "User",
					as: 'PrimaryUser',
					attributes: ['_id','email', 'Initialer', 'name'],
					where: {}
				}),
				JSON.stringify({
					model: "Locality",
					as: 'Locality',
					where: {}
				}),
			]
		)
		
	}).$promise.then(function(observations) {
		console.log("succes")
		$scope.tiles = _.filter(observations, function(u) {
			return u.Images.length > 0;
		});
	})

	
$http.jsonp('http://svampeatlasnyheder.blogspot.com/feeds/posts/default?alt=json-in-script&callback=JSON_CALLBACK')
    .success(function(data){
        $scope.news = data.feed.entry;
    });
	
	$scope.showNews = function(item){
		console.log(item)
	}
	
	
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
