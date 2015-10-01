'use strict';

angular.module('svampeatlasApp')
	.controller('HistoryLogCtrl', ['$scope', '$timeout', 'Taxon', '$state',
		function($scope, $timeout, Taxon, $state) {
			
			console.log($scope.taxon._id)
		}
	]);
