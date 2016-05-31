'use strict';

angular.module('svampeatlasApp')
  .controller('AboutCtrl',['$scope', 'Observation','appConstants',  function ($scope, Observation, appConstants) {
   
  	$scope.loaded = {};
  	$scope.failed = {};
  	$scope.imageHasLoaded = function(img){
  		$scope.loaded[img] = true;
		
  	};
  	$scope.imageHasFailed = function(img){
  		$scope.failed[img] = true;
		
  	};
  	$scope.getImageUrl = function(tile){
		
  		return appConstants.imageurl+tile.Images[0].name +".JPG";		
  	}
   
  	Observation.query({
  		nocount: true,
  		order: 'observationDate DESC',
  		limit: 50,
  		cachekey: 'latestredlisted',
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
  		
  		$scope.tiles = _.filter(observations, function(u) {
  			return u.Images.length > 0;
  		});
  	})
	



  }])
