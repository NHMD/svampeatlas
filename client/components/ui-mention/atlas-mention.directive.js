'use strict';

angular.module('svampeatlasApp')
.directive('atlasMention', function($http, SearchService){
  return {
    require: 'uiMention',
    link: function($scope, $element, $attrs, uiMention) {
      /**
       * Converts a choice object to a human-readable string
       *
       * @param  {mixed|object} choice The choice to be rendered
       * @return {string}              Human-readable string version of choice
       */
       uiMention.label = function(choice) {
         return choice.name;
       };

      /**
       * Retrieves choices
       *
       * @param  {regex.exec()} match    The trigger-text regex match object
       * @return {array[choice]|Promise} The list of possible choices
       */
      uiMention.findChoices = function(match, mentions) {
		  
		  
		  
		  return SearchService.querySearchUser(match[1]).then(function(users){
			  for(var i = 0; i < users.length; i++){
			  	users[i].id = users[i]._id
			  }
			  return users;
		  });
        //return $http.get(...).then(...);
      };
    }
  };
});