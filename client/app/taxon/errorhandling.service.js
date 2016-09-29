'use strict';

angular.module('svampeatlasApp')
	.factory('ErrorHandlingService',['$mdDialog', '$state', '$translate', function($mdDialog, $state, $translate) {

		return {
			handleTaxon404: function() {
			   
			    $mdDialog.show(
			        $mdDialog.alert()
			          
			          .clickOutsideToClose(false)
			          .title('The requested taxon id was not found.')
			          .content('You will be redirected to the search page.')
			          .ariaLabel('Taxon not found')
			          .ok('Ok')
			          
			      )
				  .then(function() {
					  $state.go('taxonomy');
				      })

			},
			handle403: function() {
			   
			    $mdDialog.show(
			        $mdDialog.alert()
			          
			          .clickOutsideToClose(false)
			          .title($translate.instant('Not allowed'))
			          .content($translate.instant('Your request cannot be fullfilled.'))
			          .ariaLabel('Not allowed')
			          .ok('Ok')
			          
			      )
				  

			},
			
			handle500: function() {
			   
			    $mdDialog.show(
			        $mdDialog.alert()
			          
			          .clickOutsideToClose(false)
			          .title($translate.instant('A server error has occurred'))
			          .content($translate.instant('Please try again later. If the problem persists, contact the system administrator.'))
			          .ariaLabel('Server error')
			          .ok('Ok')
			          
			      )
				  

			},
			
			handle504: function() {
			   
			    $mdDialog.show(
			        $mdDialog.alert()
			          
			          .clickOutsideToClose(false)
			          .title('Timeout')
			          .content($translate.instant('Din forespørgsel fik timeout fra serveren.'))
			          .ariaLabel('Time out')
			          .ok('Ok')
			          
			      )
				  .then(function() {
					  $state.go('search');
				      })

			}

		};


	}]);

