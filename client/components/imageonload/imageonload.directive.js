'use strict';

angular.module('svampeatlasApp')
.directive('imageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    //call the function that was passed
                    scope.$apply(attrs.imageonload);
                });
            }
        };
    })
	.directive('imageonerror', function() {
	        return {
	            restrict: 'A',
	            link: function(scope, element, attrs) {
	                element.bind('error', function() {
	                    //call the function that was passed
	                    scope.$apply(attrs.imageonerror);
	                });
	            }
	        };
	    })