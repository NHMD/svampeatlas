'use strict';
angular.module('svampeatlasApp')
	.factory('StoredSearchModalService', function($mdDialog, appConstants, $mdMedia) {

		return {
			show: function(ev, search, storedSearches) {
				$mdDialog.show({
					locals: {
						search: search,
						storedSearches : storedSearches
					},
					controller: ['$scope',  '$mdDialog', '$translate','StoredSearch',
						function($scope,  $mdDialog, $translate, StoredSearch) {
							$scope.$translate = $translate;
							$scope.storedSearches = storedSearches;
							var that = this;
							$scope.$watch('name', function(newVal, oldVal){
								if(newVal && newVal !== oldVal){
									that.selectedSearch = "";
								}
							})
							$scope.cancel = function() {
								$mdDialog.hide()
									
							};
							
							$scope.saveStoredSearch = function(){
								if($scope.name){
									StoredSearch.save({
										search: JSON.stringify(search),
										name: $scope.name
									}).$promise.then(function(res){
										storedSearches.push(res)
										$mdDialog.hide()
									}).catch(function(err){
										alert(err)
									})
								} else if(that.selectedSearch !== ""){
									StoredSearch.update({
						id: that.selectedSearch
					}, {search: JSON.stringify(search)}).$promise.then(function(res){
										$mdDialog.hide()
									}).catch(function(err){
										alert(err)
									})
								
							}
							
						}
					}
					],
					controllerAs: 'ctrl',
					templateUrl: 'app/search/storedSearch.modal.tpl.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: $mdMedia('xs')
				})
			}
		}


	})
