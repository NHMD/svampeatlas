'use strict';
angular.module('svampeatlasApp')
	.factory('HigherTaxonomyModalService', function($mdDialog) {

			return {
				show: function(ev, tx, usr, sender) {
			      $mdDialog.show({
					locals: {tx: tx, usr: usr},  
			        controller: ['$scope','$mdDialog','Taxon', 'tx', 'usr', '$translate',
					  				function($scope, $mdDialog,Taxon,  tx, usr, $translate) {

										$scope.taxon = tx;
										$scope.user = usr
										setTaxon(tx._id)
										
										
										
										function setTaxon(taxon_id){
											
										Taxon.getNumberOfDanishSpecies({
											id: taxon_id
										}).$promise.then(function(stats) {
											
											$scope.numberOfDanishSpecies = _.reduce(stats, function(sum, n) {
												return sum + parseInt(n.count);
											}, 0);
							
											$scope.percentageOfSpecies = ( $scope.taxon.taxoncount / $scope.numberOfDanishSpecies ) * 100 ;
											
											$scope.stars = []
											var halfStars = Math.round($scope.percentageOfSpecies / 10);
											var fullStars = Math.floor(halfStars / 2);
											for(var i = 0; i< fullStars ; i ++){
												$scope.stars.push({icon: 'star'})
											}
											
											if(Math.round(halfStars / 2) - Math.floor(halfStars / 2) !== 0){
												$scope.stars.push({icon: 'star_half'})
											}
											
											while($scope.stars.length < 5){
												$scope.stars.push({icon: 'star_border'})
											}
											
											//{icon: 'star_half'}, {icon: 'star_border'}
											
											var titleText = ($translate.use() === 'en') ? 'species recorded in Denmark: ' : 'arter i Danmark: '
											var seriesText = ($translate.use() === 'en') ? 'Species' : 'Arter';
											$scope.chartOptions = {
												options: {
													chart: {
														plotBackgroundColor: null,
														plotBorderWidth: null,
														plotShadow: false,
														type: 'pie'
													},
													title: {
														text: $scope.taxon.FullName +" - "  + $scope.numberOfDanishSpecies +" "+titleText
													},
													tooltip: {
														pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
													},
													plotOptions: {
														pie: {
															allowPointSelect: true,
															cursor: 'pointer',
															dataLabels: {
																enabled: true,
																format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f} %)',
																style: {
																	color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
																}
															}
														},
											            series: {
											                cursor: 'pointer',
											                point: {
																/*
											                    events: {
											                        click: function () {
																		setTaxon(this.options._id)
																		
							                            
											                        }
											                    }
																*/
											                }
											            }
													}
												},
												series: [{
													name: seriesText,
													colorByPoint: true,
													data: _.map(stats, function(e) {
														return {
															name: e.FullName,
															y: parseInt(e.count),
															_id: e._id
														}
													})
												}]
											}
											//$scope.stats =stats;
										})
										
									};
										
										
										
										  $scope.cancel = function() {
										    $mdDialog.hide()
											  
										  };
										  
					  				}],
			        templateUrl: 'app/profile/taxonomy-modal.tpl.html',
			        parent: angular.element(document.body),
			        targetEvent: ev,
			        clickOutsideToClose:true,
			        fullscreen: true
			      })
				}
				}
			
			
			})