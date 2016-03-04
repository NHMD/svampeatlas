'use strict';
angular.module('svampeatlasApp')
.factory('ObservationModalService', function($mdDialog, appConstants) {
						
						return {
							show: function(ev, row) {


								$mdDialog.show({
									controller: ['$scope', '$mdDialog', 'Observation', '$mdMedia', function($scope, $mdDialog, Observation, $mdMedia) {
										$scope.$mdMedia = $mdMedia;
						$scope.getDate = function(observationDate, observationDateAccuracy){
				
							var splitted = observationDate.split(" ")[0].split("-");
				
							if(observationDateAccuracy === 'month'){
								//console.log("spl "+parseInt(splitted[1]))
								return moment.months()[parseInt(splitted[1])-1] +" "+splitted[0];
							} else if(observationDateAccuracy === 'year'){
								return splitted[0];
							} else if(observationDateAccuracy === 'invalid'){
								return "ingen dato"
							}
				
						}
						$scope.forum = Observation.getForum({id: row._id});
		    			$scope.obs = Observation.get({id: row._id});
						$scope.cancel = function() {
						    $mdDialog.cancel();
						  };
		    			
		    			
		    		}],
									templateUrl: 'app/observationmodal/observation-modal.tpl.html',
									parent: angular.element(document.body),
									targetEvent: ev,
									clickOutsideToClose: true,
									fullscreen: true
								})



							}
						};
						
						
					

					}
				
				)
			  .
			    filter('capitalize', function() {
			      return function(input, all) {
			        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
			        return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
			      }
			    });