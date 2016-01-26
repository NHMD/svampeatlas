'use strict';

angular.module('svampeatlasApp')
	.controller('DkNamesModalCtrl', ['$scope',  '$mdDialog', 'Taxon',
		function($scope,  $mdDialog, Taxon) {
			
			$scope.setCurrentDkName = function(name){
				$scope.newDkNameIsInProgress = true;
				console.log(name)
				Taxon.setCurrentDKname({id: $scope.taxon._id, }, name)
				.$promise.then(function(){
					$scope.taxon.Vernacularname_DK = name;
					$scope.newDkNameIsInProgress = false;
				})
				
	
			};
			
			
			$scope.updateDkName = function(name){
				Taxon.updateDKname({id: $scope.taxon._id, nameid: name._id}, name).$promise.then(function(){
					if($scope.taxon.vernacularname_dk_id === name._id){
						$scope.taxon.Vernacularname_DK = name;
					}
				})
			}
			$scope.createNewDkName = function(){
				$scope.newDkName = {taxon_id: $scope.taxon._id, appliedLatinName: $scope.taxon.FullName};
				$scope.dkNameModal.show()
			}
			
			$scope.cancelNewName = function(){
				delete $scope.newDkName;
			}
			
			$scope.saveNewDkName = function(name){
				Taxon.addDKname({id: $scope.taxon._id}, $scope.newDkName).$promise.then(function(newname){
					$scope.taxon.DanishNames.push(newname);
					delete $scope.newDkName;
				})
			}
			
			$scope.deleteDkName = function(name){
				
			var confirm = $mdDialog.confirm()
				.title('Delete '+name.vernacularname_dk+' ?')
				.ariaLabel('Delete '+name.vernacularname_dk)
				.ok('Yes')
				.cancel('No');
			$mdDialog.show(confirm).then(function() {
				
				Taxon.deleteDKname({id: $scope.taxon._id, nameid: name._id}).$promise.then(function(){
					_.remove($scope.taxon.DanishNames, function(n) {
					  return n._id === name._id;
					});
					
				})
				
				
			}, function() {
				return false;
			});
				
				
			}
	}]);
