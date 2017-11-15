'use strict';
(function(window, angular, undefined) {
    'use strict';
	
angular.module('svampeatlasApp')
.component('notification', 
    {
      
            templateUrl: 'views/notification/notification.tmpl.html',
            controller: 'notificationCtrl'
        }
    )
.controller('notificationCtrl', [

	'$state','Auth', 'User', '$scope',
    function( $state, Auth, User, $scope) {
		var self = this;
		
  	  this.state = $state;
  	  this.currentUser = Auth.getCurrentUser();
	  
    	if(this.currentUser){
    		this.feedCount = User.getFeedCount();
    	}
			
		this.showNotifications = function(){
			$state.go('notifications')
		}
		
		$scope.$on('notification_status_changed', function(){
			self.feedCount = User.getFeedCount();
		})

    }
])
	

.run(['$templateCache', function($templateCache) {
$templateCache.put('views/notification/notification.tmpl.html',
	
	'<md-button class="feed-button" ng-click="$ctrl.showNotifications()"><ng-md-icon icon="notifications"></ng-md-icon><md-badge ng-if="$ctrl.feedCount && $ctrl.feedCount.count !== 0" ng-cloak>{{$ctrl.feedCount.count}}</md-badge></md-button>')
}]);

})(window, window.angular);


/*<a class="twitter-share-button"
  href="https://twitter.com/intent/tweet" url="{{$ctrl.sharingUri}}">
Tweet</a> */
