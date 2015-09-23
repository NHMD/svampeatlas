'use strict';

angular.module('svampeatlasApp')
.directive('stPersist', function () {
        return {
            require: '^stTable',
            link: {
            	pre: function(scope, element, attr, ctrl){
					var savedState = localStorage[attr.stPersist];
					if(savedState){
						savedState = JSON.parse(savedState);
					}
		            if (savedState){
		            var  tableState = ctrl.tableState()
		              tableState.pagination = savedState.pagination
		              tableState.sort = savedState.sort
		              tableState.search = savedState.search
					  };
            	},
				post: function(scope, element, attr, ctrl){
		          scope.$watch(function(){ return ctrl.tableState()},function (newVal, oldVal) {
		            if (newVal !== undefined && newVal !== oldVal)
		              localStorage.setItem(attr.stPersist, JSON.stringify(newVal))
				}
		          , true)
				
				}
            }
			
        };
    });
	
