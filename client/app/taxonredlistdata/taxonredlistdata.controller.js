'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonRedListDataCtrl', ['$scope', 'Taxon',  '$state' ,'$stateParams', '$timeout', 'TaxonRedListData',
		function($scope, Taxon, $state, $stateParams, $timeout, TaxonRedListData) {
		
			$scope.Taxon = Taxon;

			if ($stateParams.id && $stateParams.id !== 'new') {
							console.log("Found id " + $stateParams.id)
							$scope.taxon = Taxon.get({
								id: $stateParams.id
							});
							console.log($scope.taxon);
				
							$scope.allyearsredlistdata = TaxonRedListData.query({where: { taxon_id: $stateParams.id}, order: "year DESC"}).$promise.then(function(res){
							//	$scope.redlistdata = res[0];
								$scope.allyearsredlistdata = res;
							})

						

						};
			
		}
	])
	;
