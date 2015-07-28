'use strict';

angular.module('svampeatlasApp')
	.factory('TaxonTypeaheadService', function(Taxon) {

		return {
			getTaxon : function(viewValue) {
				
				if (viewValue === "") {
					return [];
				}
				var value = (viewValue.constructor.name === 'Resource') ? viewValue.FullName : viewValue;
				
				var params = {
					where: {
						TaxonName: {
							like: value + "%"
						}
						}, 
					limit: 30
					
				};

				return Taxon.query(params).$promise;

			},
			
			getPossibleParentTaxa : function(viewValue, selectedTaxon) {
				
				if (viewValue === "") {
					return [];
				}
				var value = (viewValue.constructor.name === 'Resource') ? viewValue.FullName : viewValue;
				
				var params = {
					where: {
						TaxonName: {
							like: value + "%"
						},
						RankID: {
							$lt: selectedTaxon.RankID
						}
					},
					order: "RankID DESC", 
					limit: 30
				};

				return Taxon.query(params).$promise;

			},
			
			getSuggestedValidTaxon : function(viewValue, selectedTaxon) {
				
				if (viewValue === "") {
					return [];
				}
				var value = (viewValue.constructor.name === 'Resource') ? viewValue.FullName : viewValue;
				
				var params = {
				where: {
					TaxonName: {
						like: value + "%"
					}
				},
				limit: 30
			}
				
				
				var RankID = {};
				
				if(selectedTaxon.RankName === "var."){
					RankID['$between'] = [10000, 15000];
				} else if (selectedTaxon.RankName === "sp."){
					RankID['$between'] = [5001, 15000];
				} else if (selectedTaxon.RankName === "superspecies"){
					RankID['$between'] = [5000, 10000];
				} else if (selectedTaxon.RankName === "gen."){
					RankID['$between'] = [4000, 10000];
				} else if (selectedTaxon.RankName === "supergenus"){
					RankID['$between'] = [4000, 10000];
				} else {
					RankID['$between'] = [100, selectedTaxon.RankID +1000];
				};
				
				params.RankID = RankID;
				
			

				return Taxon.query(params).$promise;

			}
			
			
		};


	});


