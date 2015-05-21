'use strict';

angular.module('svampeatlasApp')
  .controller('AdminCtrl', function($scope, $http, $filter, Auth, User, $modal, Role) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();
	$scope.roles = Role.query();
	
	$scope.filterAlreadyAddedRoles = function(role) {
	   return _.find($scope.user_.Roles, function(r) {
  return r._id ===  role._id;
}) === undefined;
	};
	
    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
	
	
	
	$scope.userRolesModal = $modal({
		scope: $scope,
		template: 'app/admin/modal.tpl.html',
		show: false
	});	
	
	$scope.editUser = function(user){
		$scope.user_ = user;
		console.log(user)
		$scope.userRolesModal.show();
	};
	
	$scope.removeRole = function(role){
		
		User.deleteRole({
					id: $scope.user_._id,
			roleid: role._id
				}).$promise.then(function(){
					_.remove($scope.user_.Roles, function(n) {
					  return n._id === role._id;
					});
				})
				.catch(function(err){
					console.log(err)
				});
	//	console.log(role);
		
	}
	
	$scope.addRole = function(role){
		
		User.addRole({
					_id: $scope.user_._id,
			_roleid: role._id
				}).$promise.then(function(){
					$scope.user_.Roles.push(role);
				})
				.catch(function(err){
					console.log(err)
				});
	//	console.log(role);
		
	}
	
  });
