'use strict';
 
angular.module('svampeatlasApp')
  .factory('MapBox', function ($http, $cookies, $q) {
	  

	  return { 
		  getTicket: function(){
			  if(!$cookies.get('mapboxtoken')){
				return  $http.get('/api/mapbox/token').then( function(t){
			  		var ticket = t.data;
					$cookies.put('mapboxtoken', ticket, {expires: moment().add(14, 'days').toDate()})
					return ticket;
			  	})
			  } else {
				  return $q.resolve($cookies.get('mapboxtoken'));
			  }
		//  return ticket
		  }
	  }
  });
  
  
  
  
