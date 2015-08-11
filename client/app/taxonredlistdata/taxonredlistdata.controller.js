'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonRedListDataCtrl', ['$scope', 'Taxon',  '$state' ,'$stateParams', '$timeout', 'TaxonRedListData',
		function($scope, Taxon, $state, $stateParams, $timeout, TaxonRedListData) {
		
			$scope.Taxon = Taxon;
		
			if ($stateParams.id && $stateParams.id !== 'new') {
						
							$scope.taxon = Taxon.get({
								id: $stateParams.id
							});
							
				
							$scope.allyearsredlistdata = TaxonRedListData.query({where: { taxon_id: $stateParams.id}, order: "year DESC"}).$promise.then(function(res){
							//	$scope.redlistdata = res[0];
								$scope.allyearsredlistdata = res;
							})

						

						};
			
						$scope.importRedlistDataFromSynonym = function(syn){
							
							$scope.allyearsredlistdata = TaxonRedListData.query({where: { taxon_id: syn._id}, order: "year DESC"}).$promise.then(function(res){
							//	$scope.redlistdata = res[0];
								$scope.allyearsredlistdata = [];
								
								for(var i= 0; i< res.length ; i++){
									var redlistData = new TaxonRedListData(_.omit(res[i], "_id"));
									redlistData.taxon_id = $scope.taxon._id;
									
									$scope.allyearsredlistdata.push(redlistData);
								};
								
								$scope.redListDataIsDirty = true;
							})
						}
						
						$scope.saveImportedRedlistData = function(){
							
							for(var i= 0; i< $scope.allyearsredlistdata.length ; i++){
								$scope.allyearsredlistdata[i].$save().then(function(){
									$scope.redListDataIsDirty = false;
								});
							};
						}
						
						$scope.discardImportedRedlistData = function(){
							
							$scope.taxon = Taxon.get({
								id: $stateParams.id
							});
							console.log($scope.taxon);
				
							$scope.allyearsredlistdata = TaxonRedListData.query({where: { taxon_id: $stateParams.id}, order: "year DESC"}).$promise.then(function(res){
							//	$scope.redlistdata = res[0];
								$scope.allyearsredlistdata = res;
								$scope.redListDataIsDirty = false;
							})
							
						}
			
		}
	])
	;
