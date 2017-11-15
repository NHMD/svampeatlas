'use strict';

angular.module('svampeatlasApp')
.filter('linkMentions', function(){
    return function(text) {
		
		var pattern = /@\[([^:]+):([0-9]+)]/g
		
		var match = pattern.exec(text);
		while (match != null) {
		  
			text = text.replace(match[0], "<a href='/userprofile/"+match[2]+"' target='_blank'>@"+match[1]+"</a>")
		  match = pattern.exec(text);
		}
        return text;
    }
})


