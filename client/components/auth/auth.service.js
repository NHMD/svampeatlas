'use strict';

angular.module('svampeatlasApp')
  .factory('Auth', function Auth($http, User, $cookies, $q) {
    /**
     * Return a callback or noop function
     *
     * @param  {Function|*} cb - a 'potential' function
     * @return {Function}
     */
    var safeCb = function(cb) {
      return (angular.isFunction(cb)) ? cb : angular.noop;
    },

 currentUser ;
	/*
	$interval(function(){
	    if ($cookies.get('token')) {
	      currentUser = User.get();
	    }
	}, 5000)
	*/
    if ($cookies.get('token')) {
      currentUser = User.get();
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
			exp.setHours(exp.getHours() + 5);
          $cookies.put('token', res.data.token, {expires: exp});
          currentUser = User.get();
          safeCb(callback)();
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
        return User.changePassword({ id: currentUser._id }, {
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
		  
		 if(currentUser && currentUser.$resolved && !$cookies.get('token')){
			 currentUser = null;
		 }
       
	    if (arguments.length === 0) {
          return  currentUser;
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
	  
	  hasRole: function(role, callback) {
        if (arguments.length === 1) {
          return this.getCurrentUser() && _.find(currentUser.Roles, function(r) {
			  return r.name === role;
			}) !== undefined;
        }

        return this.getCurrentUser(null)
          .then(function(user) {
            var is = ( _.find(currentUser.Roles, function(r) {
			  return r.name === role;
			}) !== undefined);
			
            safeCb(callback)(is);
            return is;
          });
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
