"use strict";
var _ = require('lodash');


module.exports = {

	secureUser : function(includeItem){
	var privateAttributes = [ 'password', 'salt', 'email' ];
		
		if(includeItem.attributes ){

      includeItem.attributes =  _.difference(includeItem.attributes , [ 'password', 'salt', 'email' ]);
		
		} else {
		
		includeItem.attributes = ['_id',
			'Initialer',
			'provider',
			'name',
			'facebook',
			'preferred_language'];
			
		}
		return includeItem;
		
	},
	
	hasRole: function(user, roleRequired){
		
		return _.find(user.Roles, function(r) {
					  return r.name === roleRequired;
					}) !== undefined
	}

};