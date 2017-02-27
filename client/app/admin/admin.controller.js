'use strict';

angular.module('svampeatlasApp')
  .controller('AdminCtrl', function($scope, $http, $filter, Auth, User, $modal, Role, $mdDialog, $mdMedia, $mdToast, appConstants, MorphoGroup) {
	 
	  $scope.User = User;
	  $scope.Auth = Auth;

	  $scope.getUserListCsv = function(){


		
	  		var mapped =  _.map($scope.users, function(e){
	  			return {
				
				
		
	  				_id: e._id,
	  				Initialer: e.Initialer,
	  				name: e.name,
	  				
					email: e.email,
	  				URI: appConstants.baseurl +"/userprofile/"+e._id
				
			
			

	  			}
	  		})
		
	  		return mapped;
	
	  }
	  
	  
  	$scope.showNewUserForm = function(ev){
  		var useFullScreen = $mdMedia('xs');
  		    $mdDialog.show({
  		      controller: ['$scope', '$mdDialog', '$mdMedia', 'User', function($scope, $mdDialog,$mdMedia, User){
			      $scope.user = {};
			      $scope.errors = {};
			  	$scope.$mdMedia = $mdMedia;
			  	$scope.cancel = function() {
			  		$mdDialog.cancel();
			  	};
				
				$scope.saveNewUser = function(form){
					User.save($scope.user).$promise.then(function(user){
						
						    $mdDialog.hide(user);
						    
						  
					})
				}
  		      }],
  		      templateUrl: 'app/admin/newuser-modal.tpl.html',
  		    //  parent: angular.element(document.body),
  		      targetEvent: ev,
  		      clickOutsideToClose:true,
  		      fullscreen: useFullScreen
  		    }).then(function(user){
			    $mdToast.show(
			      $mdToast.simple()
			        .textContent(user.name+' oprettet!')
			        .position("top right" )
			        .hideDelay(3000)
			    );
				
				$scope.users = User.query();
				
  		    })
  		   
			
		   
		
  	}

    // Use the User $resource to fetch all users
    $scope.users = User.query();
	$scope.roles = Role.query();
	$scope.morphoGroups = MorphoGroup.query();
	
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
	
	$scope.userMorphogroupModal = $modal({
		scope: $scope,
		template: 'app/admin/morphogroup-modal.tpl.html',
		show: false
	});	
	
	$scope.editUser = function(user){
		$scope.user_ = user;
		console.log(user)
		$scope.userRolesModal.show();
	};
	$scope.editUserMorphoGroups = function(user){
			$scope.user_ = user;
			User.getMorphoGroups({id: user._id}).$promise.then(function(groups){
				$scope.user_.MorphoGroups = groups;
			})
			$scope.userMorphogroupModal.show();
		};
	
		$scope.selectMorphoGroup = function(morphogroupid){
			
			var min = 1;
			var max = 100;
			var impact = 1;
			for(var i = 0; i< $scope.user_.MorphoGroups.length; i++){
				if($scope.user_.MorphoGroups[i]._id === parseInt(morphogroupid)){
					max = $scope.user_.MorphoGroups[i].UserMorphoGroupImpact.max_impact;
					min = $scope.user_.MorphoGroups[i].UserMorphoGroupImpact.min_impact;
					impact = $scope.user_.MorphoGroups[i].UserMorphoGroupImpact.impact;
					break;
				}
			}
			
			$scope.currentMorphogroup = { user_id: $scope.user_._id, morphogroup_id: morphogroupid, max_impact:  max, min_impact:  min, impact: impact };
		}
		$scope.saveUserMorphoGroupImpact = function(morphogroup){
			User.updateMorphoGroup({id: morphogroup.user_id, morphogroupid: morphogroup.morphogroup_id}, morphogroup).$promise.then(function(){
				delete $scope.currentMorphogroup;
				$scope.userMorphogroupModal.hide();
			})
			.catch(function(err){
				alert(err)
			})
		}
	
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
