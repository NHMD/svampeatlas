"use strict";



module.exports = {

	parseQueryString : function(query){

		for (var k in query){		
			
		    if (query.hasOwnProperty(k) && typeof query[k] === 'string') {
				
		        query[k] = JSON.parse(query[k])
		    }
		}
		return query;
	}

};