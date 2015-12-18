'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonBookLayoutCtrl', ['$q','$scope', 'Taxon', 'TaxonIntegrationService', 'TaxonRedListData','TaxonTypeaheadService', 'TaxonAttributes','NatureTypes', 'NutritionStrategies','$state' ,'$stateParams', '$timeout', '$modal', '$mdSidenav', '$mdUtil', '$log','ErrorHandlingService','$translate',
		function($q, $scope, Taxon, TaxonIntegrationService, TaxonRedListData, TaxonTypeaheadService,TaxonAttributes, NatureTypes,NutritionStrategies, $state, $stateParams, $timeout, $modal, $mdSidenav, $mdUtil, $log, ErrorHandlingService, $translate) {
			
			$scope.Taxon = Taxon;
			$scope.natureTypes = NatureTypes.query();
			$scope.nutritionStrategies = NutritionStrategies.query();
			$scope.basicNutritionLimit = 2;
			$scope.biotrofNutrionLimit = 10;
			$scope.$timeout = $timeout;
			$scope.stateParams = $stateParams;
 if ($stateParams.id) {
				
				$scope.taxon = Taxon.get({
					id: $stateParams.id
				})
				
				$scope.taxonAttributes	= TaxonAttributes.get({
					id: $stateParams.id
				});
			
								
				$scope.taxon.$promise.then(function() {
					$scope.taxon.siblings = Taxon.getSiblings({
									id: $scope.taxon._id
								});
				}).catch(function(err){
					if(err.status === 404){
						ErrorHandlingService.handleTaxon404();
					}
				});

				$scope.redlistdata = TaxonRedListData.query({where: { taxon_id: $stateParams.id}, year: 2009}).$promise.then(function(res){
				//	$scope.redlistdata = res[0];
					$scope.redlistdata = res;
					
				})
				
				$scope.taxon.$promise.then(function() {
					$scope.$watch('taxon.images', function(newVal, oldVal) {
						if (newVal !== undefined && newVal !== oldVal) {
							$scope.currentImage = $scope.getCurrentImage();
						}
					}, true);

				})
				
				
				$q.all([$scope.taxon.$promise, $scope.natureTypes.$promise]).then(function(){
					
					for(var i=0; i< $scope.taxon.naturtyper.length; i++ ) {
				
					    _.find($scope.natureTypes, function(nt) {
					    				   return nt._id === $scope.taxon.naturtyper[i]._id;
					   			   }).isChecked = true;
					}

				});
				
				$q.all([$scope.taxon.$promise, $scope.nutritionStrategies.$promise]).then(function(){
					
					for(var i=0; i< $scope.taxon.nutritionstrategies.length; i++ ) {
						if($scope.taxon.nutritionstrategies[i]._id === 1){
							$scope.taxon.isBiotroph = true;
						}
					    _.find($scope.nutritionStrategies, function(nt) {
					    				   return nt._id === $scope.taxon.nutritionstrategies[i]._id;
					   			   }).isChecked = true;
					}

				});

				
			};

			$scope.TaxonTypeaheadService = TaxonTypeaheadService;
			
		

			$scope.getCurrentImage = function() {
				return _.find($scope.taxon.images, function(img) {
					return img.active === true;
				});
			}




			$scope.taxonHasNatureType = function(natureTypeId){
				
				return _.find($scope.taxon.naturtyper, function(nt) {
 				   return nt._id === natureTypeId;
			   }) ;
			};
			
			
			$scope.addOrRemoveNatureType = function(type){
				
				if(type.isChecked && !$scope.taxonHasNatureType(type._id)){
					// create the type
					Taxon.addNatureType({
					id: $scope.taxon._id
				}, type).$promise.then(function(){
					$scope.taxon.naturtyper.push(type)
				}).catch(function(err){
					type.isChecked = !type.isChecked
				})
				}
				else if(!type.isChecked && $scope.taxonHasNatureType(type._id)){
					// delete the type
					Taxon.deleteNatureType({
					id: $scope.taxon._id,
						naturetypeid: 	type._id
				}).$promise.then(function(){
					_.remove($scope.taxon.naturtyper, function(t) {
					  return t._id == type._id;
					});
				}).catch(function(err){
					type.isChecked = !type.isChecked
				})
					
				}
				
			};
			
			$scope.taxonHasNutritionStrategy = function(nutritionStrategyId){
				
				return( _.find($scope.taxon.nutritionstrategies, function(nt) {
 				   return nt._id === nutritionStrategyId;
			   })) ? true : false ;
			};
			
			$scope.addOrRemoveNutritionStrategy = function(type){
				
				if(type.isChecked && !$scope.taxonHasNutritionStrategy(type._id)){
					// create the type
					Taxon.addNutritionStrategy({
					id: $scope.taxon._id
				}, type).$promise.then(function(){
					
					$scope.taxon.nutritionstrategies.push(type)
					if(type._id === 1){
						$scope.taxon.isBiotroph = $scope.taxonHasNutritionStrategy(type._id);
						console.log($scope.taxon.isBiotroph)
					}
				}).catch(function(err){
					
					type.isChecked = $scope.taxonHasNutritionStrategy(type._id);
				})
				}
				else if(!type.isChecked && $scope.taxonHasNutritionStrategy(type._id)){
					// delete the type
					Taxon.deleteNutritionStrategy({
					id: $scope.taxon._id,
						nutritionstrategyid: 	type._id
				}).$promise.then(function(){
					
					_.remove($scope.taxon.nutritionstrategies, function(t) {
					  return t._id == type._id;
					});
					if(type._id === 1){
						$scope.taxon.isBiotroph = $scope.taxonHasNutritionStrategy(type._id);
						console.log($scope.taxon.isBiotroph)
					}
				}).catch(function(err){
					
					type.isChecked = $scope.taxonHasNutritionStrategy(type._id);
					
				})
					
				}		
				
			};
			
			
			
			

		
		$scope.toggleSimilarSpecies = buildToggler('similarAside');
		    $scope.toggleIframe = buildToggler('iframeAside');
		    /**
		     * Build handler to open/close a SideNav; when animation finishes
		     * report completion in console
		     */
		    function buildToggler(navID) {
		      var debounceFn =  $mdUtil.debounce(function(){
		            $mdSidenav(navID)
		              .toggle()
		              .then(function () {
		                $log.debug("toggle " + navID + " is done");
		              });
		          },200);
		      return debounceFn;
		    }
		
		    $scope.closeSideNav = function (nav) {
		         $mdSidenav(nav).close()
		           .then(function () {
		             $log.debug("close RIGHT is done");
		           });
		       };
			   $scope.getIframeSrc = function(){
			   
   					return "http://svampe.dk/soeg/filemaker.php?DKIndex=" +$stateParams.id;
   		
				
			   }
			   
			   $scope.getBogtekstLength = function(){
				   return $("#bogtekst").text().length;
				
			   }
		/*	$scope.ranktabs = [
			    { title:'Change parent',  active: true},
			    { title:'Choose new rank'   },
				{ title:'Taxon'  },
				{ title:'Log'}
			  ];
			
			  
			
			$scope.selectRankTab = function(tab){
				
				
				
			}
			*/
		}
	]);
