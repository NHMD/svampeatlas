'use strict';
 
angular.module('svampeatlasApp')
  .factory('KMS', function ($http, $cookies) {
	  

	  var ticket;
	  
	  if($cookies.get('kfticket')){
		  ticket = $cookies.get('kfticket');
	  } else {
		  $http.get('/api/kms/ticket').then( function(t){
	  		ticket = t.data;
			$cookies.put('kfticket', ticket, {expires: moment().add(23, 'hours').toDate()})
	  	})
	 
	  }
		  return { 
			  getTicket: function(){
			  return ticket}
		  }
  });
  
  
  
  
