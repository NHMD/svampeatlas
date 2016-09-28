'use strict';
 
angular.module('svampeatlasApp')
  .factory('MapBox', function ($http, $cookies, appConstants) {
	  

	  var ticket;
	  /*
	  if($cookies.get('mapboxtoken')){
		  ticket = $cookies.get('mapboxtoken');
	  } else {
		  $http.get('/api/mapbox/token').then( function(t){
	  		ticket = t;
			$cookies.put('mapboxtoken', ticket, {expires: moment().add(14, 'days').toDate()})
	  	})
	 
	  }
	  */
	  $cookies.put('mapboxtoken', appConstants.MapBoxToken, {expires: moment().add(14, 'days').toDate()});
	  
		  return { 
			  getTicket: function(){
				  /*
				  if(!$cookies.get('mapboxtoken')){
					  $http.get('/api/mapbox/token').then( function(t){
				  		ticket = t;
						$cookies.put('mapboxtoken', ticket, {expires: moment().add(14, 'days').toDate()})
				  	})
				  }
				  */
				  return appConstants.MapBoxToken;
			  }
		  }
  });
  
  
  
  
