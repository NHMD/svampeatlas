'use strict';
(function(window, angular, undefined) {
    'use strict';
	
angular.module('svampeatlasApp')
.component('sharing', 
    {
            bindings: {
                mailSubject: '=mailSubject',
				mailBody: '=mailBody',
				sharingUri: '=sharingUri'
            },
            templateUrl: 'views/sharing/sharing.tmpl.html',
            controller: 'sharingCtrl'
        }
    )
.controller('sharingCtrl', [

	'$window',
    function( $window) {
		var self = this;
		this.sendMail = function(){
		    $window.open("mailto:"+ "" + "?subject=" + this.mailSubject+"&body="+this.mailBody,"_self");
		};
		
		this.shareOnFacebook = function(){
			FB.ui(
			 {
			  method: 'share',
			  href: self.sharingUri
			}, function(response){
				
			});
		}
		
		this.tweet = function(){
			$window.open( "https://twitter.com/intent/tweet?url="+self.sharingUri+"&hashtags=fungi,mycology,svampeatlas,atlasofdanishfungi","_blank");
		}
		
		this.shareOnGooglePLus = function(){
			$window.open( "https://plus.google.com/share?url="+self.sharingUri+"&hl=da","_blank");
		}
		
		function showTooltip(elem, msg) {
			elem.setAttribute('class', 'clipboard-copy tooltipped tooltipped-e');
			elem.setAttribute('aria-label', msg);
		}
		
		var clipboard = new Clipboard('.clipboard-copy-sharing');
		clipboard.on('success', function(e) {
			e.clearSelection();

			showTooltip(e.trigger, 'Copied!');
		});
		clipboard.on('error', function(e) {

			showTooltip(e.trigger, fallbackMessage(e.action));
		});

    }
])
	

.run(['$templateCache', function($templateCache) {
$templateCache.put('views/sharing/sharing.tmpl.html',
	
	'<md-menu md-position-mode="target-right target" >'
	 
  	           + '<md-button aria-label="Open demo menu" class="md-icon-button" ng-click="$mdOpenMenu($event)">'
  	            +  ' <ng-md-icon icon="share" ></ng-md-icon>'
  	           +' </md-button>'
  	           +' <md-menu-content width="3" >'
  	            +  '<md-menu-item >'
  	             +  ' <md-button ng-click="$ctrl.shareOnFacebook()">'
  	              +      '<div layout="row" flex>'
							
  	               +       '<p flex><ng-md-icon icon="facebook" style="margin: auto 3px auto 0;"></ng-md-icon> {{"Facebook" | translate}}</p>'
	                      
  	                +    '</div>'
  	                +'</md-button>'
  	              +'</md-menu-item>'
  	            +  '<md-menu-item >'
  	             +  ' <md-button ng-click="$ctrl.tweet()">'
  	              +      '<div layout="row" flex>'
							
  	               +       '<p flex><ng-md-icon icon="twitter" style="margin: auto 3px auto 0;"></ng-md-icon> {{"Twitter" | translate}}</p>'
	                      
  	                +    '</div>'
  	                +'</md-button>'
  	              +'</md-menu-item>'
  	              +'</md-menu-item>'
  	            +  '<md-menu-item >'
  	             +  ' <md-button ng-click="$ctrl.shareOnGooglePLus()">'
  	              +      '<div layout="row" flex>'
							
  	               +       '<p flex><ng-md-icon icon="google-plus" style="margin: auto 3px auto 0;"></ng-md-icon> {{"Google+" | translate}}</p>'
	                      
  	                +    '</div>'
  	                +'</md-button>'
  	              +'</md-menu-item>'
	
  	              +'<md-menu-item >'
  	              +  '<md-button ng-click="$ctrl.sendMail()">'
  	               +     '<div layout="row" flex>'
							
  	                +      '<p flex><ng-md-icon  icon="email" style="margin: auto 3px auto 0;"></ng-md-icon> {{"Email"  | translate}}</p>'
	                      
						 
  	                +   ' </div>'
  	              + ' </md-button>'
  	              + '</md-menu-item>'
  	              +'<md-menu-item >'
  	              +  '<md-button >'
  	               +     '<div layout="row" flex>'
							
  	                +      '<p flex><ng-md-icon  icon="link" style="margin: auto 3px auto 0;"></ng-md-icon> <span class="clipboard-copy-sharing" data-clipboard-text="{{$ctrl.sharingUri}}">{{"Kopier link" | translate}}</span></p>'
	                      
						 
  	                +   ' </div>'
  	              + ' </md-button>'
  	              + '</md-menu-item>'
	          
  	         +   '</md-menu-content>'
  	         + '</md-menu>')
}]);

})(window, window.angular);


/*<a class="twitter-share-button"
  href="https://twitter.com/intent/tweet" url="{{$ctrl.sharingUri}}">
Tweet</a> */
