'use strict';

angular.module('svampeatlasApp')
  .controller('TaxonMorphoGroupUserCtrl', function ($scope, $stateParams, $mdMedia, MorphoGroup) {
	  var that = this;
	  this.mdMedia = $mdMedia;
	  this.Users = MorphoGroup.getUsers({id: $stateParams.id })
	  
	  this.isLoading = true;
	  
	  this.Users.$promise.then(function(){
	  	that.isLoading = false;
		
	  }).catch(function(err){
	  	that.isLoading = false;
	  })

  })
