'use strict';

angular.module('svampeatlasApp')
    .directive('stPaginationScroll', ['$timeout', function (timeout) {
        return{
            require: 'stTable',
            link: function (scope, element, attr, ctrl) {
                var itemByPage = 500;
                var pagination = ctrl.tableState().pagination;
                var lengthThreshold = 50;
                var timeThreshold = 400;
                var handler = function () {
                    //call next page
                    ctrl.slice(pagination.start + itemByPage, itemByPage);
                };
                var prevHandler = function () {
                    //call prev page
					if(pagination.start - itemByPage > -1){
						ctrl.slice(pagination.start - itemByPage, itemByPage);
					}
                    
                };
                var promise = null;
                var lastRemaining = 9999;
                var container = angular.element(element.parent());
				
				
				var lastScrollTop = 0;
				

                container.bind('scroll', function () {
					
 				   var st = $(container).scrollTop();
 				   if (st > lastScrollTop){
                       var remaining = container[0].scrollHeight - (container[0].clientHeight + container[0].scrollTop);

                       //if we have reached the threshold and we scroll down
                       if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {

                           //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
                           if (promise !== null) {
                               timeout.cancel(promise);
                           }
                           promise = timeout(function () {
                               handler();

                               //scroll a bit up
                               container[0].scrollTop -= 500;

                               promise = null;
                           }, timeThreshold);
                       }
                       lastRemaining = remaining;
 				   } else if(st < lastScrollTop){

                       var remaining = container[0].scrollHeight - (container[0].clientHeight + container[0].scrollTop);

                       //if we have reached the threshold and we scroll down
                       if (container[0].scrollTop === 0) {

                           //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
                           if (promise !== null) {
                               timeout.cancel(promise);
                           }
                           promise = timeout(function () {
		   					if(pagination.start - itemByPage > -1){
		   						ctrl.slice(pagination.start - itemByPage, itemByPage);
								container[0].scrollTop += 500;
		   					}
                               

                               promise = null;
                           }, timeThreshold);
                       }
                       lastRemaining = remaining;
					  
 				      // upscroll code
 				   }
				   
 				   lastScrollTop = st;
					
                    
                });
            }

        };
    }]);