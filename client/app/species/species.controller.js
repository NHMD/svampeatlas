'use strict';

angular.module('svampeatlasApp')
  .controller('SpeciesCtrl', function($scope,  $translate, $mdMedia, Taxon,  Observation, Locality, appConstants, leafletData, $timeout, ObservationModalService,  $state, $stateParams ) {
	 
	//  $scope.isChrome = (/Chrome/i.test(navigator.userAgent));
	 
	  $scope.$state = $state;
	 

	  $scope.ObservationModalService = ObservationModalService;
	  
	$scope.capitalizeFirstLetter = function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	$scope.lowerCaseFirstLetter = function (string) {
		return string.charAt(0).toLowerCase() + string.slice(1);
	}
	  
	$scope.taxon = Taxon.getAcceptedTaxon({
		id: $stateParams.taxon_id
	})
	
	$scope.taxon.$promise.then(function(){
		
		_.each($scope.taxon.synonyms, function(s){
			if(s._id !== s.accepted_id){
				$scope.taxon.images = $scope.taxon.images.concat(s.images)
			}
		});
	    $scope.tiles = 	Observation.query({
	    		nocount: true,
	    		order: 'observationDate DESC',
	    		limit: 24,
  		
		
	    		include: JSON.stringify(
	    			[
	    				JSON.stringify({
	    					model: "DeterminationView",
	    					as: "DeterminationView",
	    					where: {
	    						Taxon_id: $scope.taxon.accepted_id,
	    						Determination_validation: 'Godkendt'
	    					}
	    				}),
	    				JSON.stringify({
	    					model: "ObservationImage",
	    					as: 'Images',
	    					required: true,
	  					where: {hide: 0}

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
		
	    	})
	})
	
	  
	  
	  
	  
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
	  
 
	  
	
  })

