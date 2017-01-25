'use strict';

angular.module('svampeatlasApp')
	.factory('Auth', function Auth($http, User, $cookies, $q, $translate, $rootScope) {
		/**
		 * Return a callback or noop function
		 *
		 * @param  {Function|*} cb - a 'potential' function
		 * @return {Function}
		 */
		var safeCb = function(cb) {
			return (angular.isFunction(cb)) ? cb : angular.noop;
		},

			currentUser;
		/*
	$interval(function(){
	    if ($cookies.get('token')) {
	      currentUser = User.get();
	    }
	}, 5000)
	*/
			
			function mapRoles(usr){
							if(usr.Roles && usr.Roles.length > 0){
								usr.roles_ = {};
								for(var i = 0; i< usr.Roles.length; i++){
									usr.roles_[usr.Roles[i].name] = true;
								}
							}
				
						}	;

		if ($cookies.get('token')) {
			currentUser = User.get();
			currentUser.$promise.then(mapRoles)
		}

		return {


			/**
			 * Authenticate user and save token
			 *
			 * @param  {Object}   user     - login info
			 * @param  {Function} callback - optional, function(error)
			 * @return {Promise}
			 */
			login: function(user, callback) {
				return $http.post('/auth/local', {
					Initialer: user.Initialer,
					password: user.password
				})
					.then(function(res) {
						var exp = new Date();
						exp.setHours(exp.getHours() + 24*7);
						$cookies.put('token', res.data.token, {
							expires: exp
						});

						currentUser = User.get();
						currentUser.$promise.then(mapRoles);
						safeCb(callback)();
						$rootScope.$broadcast('logged_in', currentUser);
						return res.data;
					}, function(err) {
						this.logout();
						safeCb(callback)(err.data);
						return $q.reject(err.data);
					}.bind(this));
			},
			
			refreshUser: function(){
				currentUser = User.get();
				currentUser.$promise.then(mapRoles);
				return currentUser.$promise;
			},

			loginOauth: function(provider, callback) {
				return $http.get('/auth/' + provider)
					.then(function(res) {
						var exp = new Date();
						exp.setHours(exp.getHours() + 5);
						$cookies.put('token', res.data.token, {
							expires: exp
						});

						currentUser = User.get();
						currentUser.$promise.then(mapRoles);
						safeCb(callback)();
						$rootScope.$broadcast('logged_in', currentUser);
						return res.data;
					}, function(err) {
						this.logout();
						safeCb(callback)(err.data);
						return $q.reject(err.data);
					}.bind(this));
			},
			/**
			 * Delete access token and user info
			 */
			logout: function() {
				$cookies.remove('token');
				currentUser = null;
			},

			/**
			 * Create a new user
			 *
			 * @param  {Object}   user     - user info
			 * @param  {Function} callback - optional, function(error, user)
			 * @return {Promise}
			 */
			createUser: function(user, callback) {
				return User.save(user,
					function(data) {
						$cookies.put('token', data.token);
						currentUser = User.get();
						return safeCb(callback)(null, user);
					},
					function(err) {
						this.logout();
						return safeCb(callback)(err);
					}.bind(this)).$promise;
			},

			/**
			 * Change password
			 *
			 * @param  {String}   oldPassword
			 * @param  {String}   newPassword
			 * @param  {Function} callback    - optional, function(error, user)
			 * @return {Promise}
			 */
			changePassword: function(oldPassword, newPassword, callback) {
				return User.changePassword({
					id: currentUser._id
				}, {
					oldPassword: oldPassword,
					newPassword: newPassword
				}, function(user) {
					return safeCb(callback)(null, user);
				}, function(err) {
					return safeCb(callback)(err);
				}).$promise;
			},



			/**
			 * Gets all available info on a user
			 *   (synchronous|asynchronous)
			 *
			 * @param  {Function|*} callback - optional, funciton(user)
			 * @return {Object|Promise}
			 */
			getCurrentUser: function(callback) {

				// if theres is a user and the promise is resolved but the token has expired, reset user:

				if (currentUser && currentUser.$resolved && !$cookies.get('token')) {
					currentUser = null;
				}

				if (arguments.length === 0) {
					return currentUser;
				}

				var value = (currentUser && currentUser.hasOwnProperty('$promise')) ? currentUser.$promise : currentUser;
				return $q.when(value)
					.then(function(user) {
						safeCb(callback)(user);
						return user;
					}, function() {
						safeCb(callback)({});
						return null;
					});
			},
			/*
			getCurrentUserAsync: function() {

				// if theres is a user and the promise is resolved but the token has expired, reset user:

				if (currentUser && currentUser.$resolved && !$cookies.get('token')) {
					currentUser = null;
				}


				if (currentUser && currentUser.hasOwnProperty('$promise')) {
					return currentUser.$promise;
				}
				else {
					var deferred = $q.defer();
					deferred.resolve(currentUser); // could be undefined
					 return deferred.promise;
				} 
				
			},
			*/

			/**
			 * Check if a user is logged in
			 *   (synchronous|asynchronous)
			 *
			 * @param  {Function|*} callback - optional, function(is)
			 * @return {Bool|Promise}
			 */
			isLoggedIn: function(callback) {
				if (arguments.length === 0) {
					return currentUser;
				}

				return this.getCurrentUser(null)
					.then(function(user) {
						var is = user && user.hasOwnProperty('Roles');
						safeCb(callback)(is);
						return is;
					});
			},

			/**
			 * Check if a user is an admin
			 *   (synchronous|asynchronous)
			 *
			 * @param  {Function|*} callback - optional, function(is)
			 * @return {Bool|Promise}
			 */
			isAdmin: function(callback) {

				if (arguments.length === 0) {
					return currentUser.role === 'useradmin';
				}

				return this.getCurrentUser(null)
					.then(function(user) {
						var is = user.role === 'useradmin';
						safeCb(callback)(is);
						return is;
					});
			},

			hasRole: function(role) {
				
				if(!currentUser || !currentUser.roles_) {
					return false;
				} else if(role === "any"){
					return currentUser.roles_ !== undefined;
				} else {
					var acceptedRoles = [].concat(role);
					for(var i=0; i< acceptedRoles.length; i++){
						if(currentUser.roles_[acceptedRoles[i]] === true){
							return true;
							break;
						}
						return false;
					}
				}
				/*
				var acceptedRoles = [].concat(role);
				if (arguments.length === 1) {
					if (role === "any") {
						return currentUser.Roles && currentUser.Roles.length > 0;
					} else {
						
						
						var hasRole = false;
						if(this.getCurrentUser()){
						for(var i=0; i< acceptedRoles.length; i++){
							if(_.find(currentUser.Roles, function(r) {
							return r.name === acceptedRoles[i];
						}) !== undefined){
							hasRole = true;
						}
						}
					}
						return hasRole;
					}
				}

				return this.getCurrentUser(null)
					.then(function(user) {
						var hasRole = false;
						if(this.getCurrentUser()){
						for(var i=0; i< acceptedRoles.length; i++){
							if(_.find(currentUser.Roles, function(r) {
							return r.name === acceptedRoles[i];
						}) !== undefined){
							hasRole = true;
						}
						}
					}
						safeCb(callback)(hasRole);
						return hasRole;
					});
					*/
			},

			/**
			 * Get auth token
			 *
			 * @return {String} - a token string used for authenticating
			 */
			getToken: function() {
				return $cookies.get('token');
			}
		};
	});
