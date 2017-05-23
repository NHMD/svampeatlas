'use strict';
angular.module('svampeatlasApp')
	.factory('MycoKeyModalService', function($mdPanel, appConstants, $mdMedia, $mdToast, $translate, ErrorHandlingService, $filter, Observation, MycokeyCharacters) {

		
		var mycokeyCharacters = MycokeyCharacters.query();
		var mycokeyGroups = MycokeyCharacters.getGroups();	
		
		return {
			show: function(ev, taxon) {
				
				
	
				
  			  var config = {
  			    attachTo: angular.element(document.body),

  				locals: {
  					taxon: taxon
  				},
  			    controllerAs: 'ctrl',
  			    disableParentScroll: false,
				panelClass: 'mycokey-panel-scroll',
  			    templateUrl: 'app/species/mycokey-character-panel.tpl.html',
  			    hasBackdrop: true,
				escapeToClose: true,
				/*
  			    position: $mdPanel.newPanelPosition()
		      .center(),
				*/
  			  //  trapFocus: true,
  			    zIndex: 85,
  			    clickOutsideToClose: true,
  			
  			    focusOnOpen: true,
				fullscreen: $mdMedia('xs'),
				/*
  				animation:   $mdPanel.newPanelAnimation()
  				  .openFrom(ev.currentTarget)
  				  .closeTo(ev.currentTarget)
  				  .withAnimation($mdPanel.animation.SCALE),
				*/
  			    controller: ['$scope','$rootScope','mdPanelRef'	,'taxon',	'$translate','$q', 'Taxon', function ($scope,$rootScope, mdPanelRef, taxon,  $translate, $q, Taxon) {
			  var that = this;
			 
			  this._mdPanelRef = mdPanelRef;
			  $scope.taxon = Taxon.get({id: taxon._id});
			  $scope.mycokeyMap = {}; 
			  $scope.$translate = $translate;
			  
			  $scope.mycokeyCharacters = mycokeyCharacters;
			  $scope.mycokeyGroups = mycokeyGroups;
			  $q.all([mycokeyCharacters.$promise, mycokeyGroups.$promise, $scope.taxon.$promise]).then(function(){
	  			_.each($scope.mycokeyCharacters, function(c){
	  				$scope.mycokeyMap[c.CharacterID] = c;
	  			})
			
	  			_.each($scope.taxon.character1, function(c){
	  				$scope.mycokeyMap[c.CharacterID].isChecked = true;
	  				$scope.mycokeyMap[c.CharacterID].RealValueMin = c.RealValueMin;
	  				$scope.mycokeyMap[c.CharacterID].RealValueMax = c.RealValueMax;
	  			})
			  });
			  
  			$scope.updateMycoKeyCharacter = function(characterId){
  				if($scope.mycokeyMap[characterId].Type === 'Bool'){
  					if($scope.mycokeyMap[characterId].isChecked) {
  						Taxon.addMycoKeyCharacter({id: $scope.taxon._id}, $scope.mycokeyMap[characterId]);
  					} else {
  						Taxon.deleteMycoKeyCharacter({id: $scope.taxon._id, characterid: characterId})
  					}
  				} else if($scope.mycokeyMap[characterId].Type === 'Real') {
  					if(!isNaN(parseFloat($scope.mycokeyMap[characterId].RealValueMin)) && !isNaN(parseFloat($scope.mycokeyMap[characterId].RealValueMax))) {
  						Taxon.addMycoKeyCharacter({id: $scope.taxon._id}, $scope.mycokeyMap[characterId]);
  					} 
  				}
				
				
				
  			}
	
			  
			this.$translate = $translate;

  			
			this.closeDialog = function() {
			 mdPanelRef.close().then(function() {
			    //angular.element(document.querySelector(ev.currentTarget)).focus();
			    mdPanelRef.destroy();
			  });
			};
			
			

			
			
			
			}],
  			  };
			  
			  $mdPanel.open(config);
					
			}
		}


	})
