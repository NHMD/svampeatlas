"use strict";
var _ = require('lodash');


module.exports = {

	secureUser : function(includeItem){
	var privateAttributes = [ 'password', 'salt' ];
		
		if(includeItem.attributes ){

      includeItem.attributes =  _.difference(includeItem.attributes , [ 'password', 'salt' ]);
		
		} else {
		
		includeItem.attributes = ['_id',
			'Initialer',
			'email' ,
			'provider',
			'name',
			'facebook',
			'preferred_language'];
			
		}
		return includeItem;
		
	}

};