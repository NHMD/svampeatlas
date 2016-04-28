'use strict';
 
angular.module('svampeatlasApp')
  .factory('KMS', function ($http, $cookies, $q) {
	  

		  return { 
			  getTicket: function(){
				  if(!$cookies.get('kfticket')){
					return  $http.get('/api/kms/ticket').then( function(t){
				  		var ticket = t.data;
						$cookies.put('kfticket', ticket, {expires: moment().add(23, 'hours').toDate()})
						return ticket;
				  	})
				  } else {
					  return $q.resolve($cookies.get('kfticket'));
				  }
			//  return ticket
			  }
		  }
  });
  
  
  
  
