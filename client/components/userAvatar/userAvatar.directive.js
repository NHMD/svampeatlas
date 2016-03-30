'use strict';

angular
.module('userAvatar', [])
.directive('userAvatar', ["avatarService", function (avatarService) {
	var controller = function ($scope) {
		$scope.ImageAvailable = false;
		if($scope.User === null){
			$scope.GenericAvatar = avatarService.getAvatar({ Initialer: "?"});
		}
		else if($scope.User.hasOwnProperty('$promise')){
			$scope.User.$promise.then(function(User){
				if (User.facebook === null || User.facebook == undefined) {
					$scope.GenericAvatar = avatarService.getAvatar(User);
				} else {
					$scope.ImageAvailable = true;
				}
			})
		} else {
			if ($scope.User.facebook === null || $scope.User.facebook == undefined) {
				$scope.GenericAvatar = avatarService.getAvatar($scope.User);
			} else {
				$scope.ImageAvailable = true;
			}
		}
		
		
	};
	
	
	return {
		
		scope: {
			User: '=user',
			size: '=size'
		},
		template: '<div ng-class="size===\'large\' ? \'generic-avatar-large\' : \'generic-avatar-small\'">'+
		'<a class="thumb spacer animated fadeIn" ng-class="size===\'large\' ? \'color-large\' : \'color-small\'" style="background-color:{{GenericAvatar.Background}}"></a>'+
		'<p ng-class="size===\'large\' ? \'name-large\' : \'name-small\'">{{GenericAvatar.Initials}}</p>' +
		'<a ng-class="size===\'large\' ? \'img-large\' : \'img-small\'" data-ng-if="ImageAvailable" style="background-image:url(http://graph.facebook.com/{{User.facebook}}/picture?width=200&height=200)"></a>' +
		'</div>',
		controller: controller
	};
}])
.factory("avatarService", function(){
    var avatarService = function(user){
      var colorCodes = {
				1: '#F44336',
				2: '#E91E63',
				3: '#9C27B0',
				4: '#2196F3',
				5: '#3F51B5',
		  		6: '#FFEB3B',
				7:'#009688', 
				8: '#8BC34A',
				9: '#CDDC39',
				10: '#00BCD4'
			};
			
			
			/*
			var i1 = "", i2 = "", nameArray = [];
			if (angular.isDefined(user.Name)) {
				i1 = angular.uppercase(user.Name.charAt(0));
				nameArray = user.Name.split(" ");
				if (nameArray.length > 2) {
					i2 = angular.uppercase(nameArray[nameArray.length - 1].charAt(0));
				} else {
					i2 = angular.uppercase(nameArray[1].charAt(0));
				}
			} else {
				i1 = angular.uppercase(user.FirstName.charAt(0));
				nameArray = user.LastName.split(" ");
				if (nameArray.length > 2) {
					i2 = nameArray[nameArray.length - 1].charAt(0);
				} else {
					i2 = angular.uppercase(nameArray[0].charAt(0));
				}
			}
			*/
			var initials = user.Initialer.toUpperCase();
			var charCode = user.Initialer.charCodeAt(1) + user.Initialer.charCodeAt(0);
			charCode = charCode >= 130 && charCode <= 140 ? 1 : charCode >= 141 && charCode <= 149 ? 2 : charCode >= 150 && charCode <= 153 ? 3 : charCode >= 154 && charCode <= 157 ? 4  : charCode >= 158 && charCode <= 160 ? 5 : charCode >= 161 && charCode <= 163 ? 6 : charCode >= 164 && charCode <= 167 ? 7 : charCode >= 168 && charCode <= 173 ? 8 : charCode >= 174 && charCode <= 182 ? 9 : 10; 
			
			
			var background = colorCodes[charCode];
			return ({ "Initials": initials, "Background": background });
    }
    return {
      getAvatar: avatarService
    }
});
	
