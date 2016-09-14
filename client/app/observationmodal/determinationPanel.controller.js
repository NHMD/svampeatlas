'use strict';

angular.module('svampeatlasApp')
	.controller('DeterminationPanelCtrl',	['mdPanelRef'	,'obs',	'$cookies',function (mdPanelRef, obs, $cookies) {
			  this._mdPanelRef = mdPanelRef;
			  this.obs = obs;
			  this.moment = moment;
  			this.getCreatedAt = function(createdAt){
  				var lang = "da";
  				if($cookies.get('preferred_language') === "en"){
  					lang = "en"
  				}
  				return moment(createdAt).lang(lang).fromNow();
  			};
			
			this.closeDialog = function() {
			 mdPanelRef.close().then(function() {
			    angular.element(document.querySelector('#determinations-btn')).focus();
			    mdPanelRef.destroy();
			  });
			};
			
			
			}])
			
			
			
			
			
			
			
			
			
			
			
			
			
	