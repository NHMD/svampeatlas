'use strict';

angular.module('svampeatlasApp')
	.factory('ErrorHandlingService',['$mdDialog', '$state', function($mdDialog, $state) {

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

			}

		};


	}]);

