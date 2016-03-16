'use strict';
 
angular.module('svampeatlasApp')
  .factory('ArcGis', function ($http, $cookies) {
	  

	  var ticket;
	  
	  if($cookies.get('arcgistoken')){
		  ticket = $cookies.get('arcgistoken');
	  } else {
		  $http.get('/api/arcgis/token').then( function(t){
	  		ticket = t.data;
			$cookies.put('arcgistoken', ticket, {expires: moment().add(23, 'hours').toDate()})
	  	})
	 
	  }
		  return { 
			  getTicket: function(){
				  if(!$cookies.get('arcgistoken')){
					  $http.get('/api/arcgis/token').then( function(t){
				  		ticket = t.data;
						$cookies.put('arcgistoken', ticket, {expires: moment().add(23, 'hours').toDate()})
				  	})
				  }
			  return ticket
			  }
		  }
  });
  
  
  
  
