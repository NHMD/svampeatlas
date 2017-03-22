'use strict';
angular.module('svampeatlasApp')
	.factory('SearchService', function($http, Locality, Taxon, PlantTaxon, User, Substrate, VegetationType, Area, DataSet, MorphoGroup) {
		
		var substrate = Substrate.query();
		var vegetationType = VegetationType.query();
		var municipalities = Area.query({where: {type: 'kommune'}})
		var dataSet = DataSet.query({cachekey : 'dataSet'});
		var morphoGroup = MorphoGroup.query();
		return {
			getDataSet : function(){
				return dataSet.$promise;
			},
			getSubstrate : function(){
				return substrate.$promise;
			},
			getVegetationType : function(){
				return vegetationType.$promise;
			},
			getMunicipalities : function(){
				return municipalities.$promise;
			},
			getMorphoGroup : function(){
				return morphoGroup.$promise;
			},
			reloadMorphoGroup : function(){
				 morphoGroup = MorphoGroup.query();
				 return morphoGroup.$promise;
			},
			querySearchLocality : function(query, leafletBounds) {

				var q = {
					where: {
						name: {
							like: "%" + query + "%"
						}
					},
					include: JSON.stringify([JSON.stringify({
						model: "Area",
						as: 'Municipality',
						attributes:['name']
					})]),
					limit: 30,
					order: "probability DESC, name ASC"

				};

				if (leafletBounds) {

					var bounds = leafletBounds;


					q.where.decimalLongitude = {
						$between: [bounds.getWest(), bounds.getEast()]
					}
					q.where.decimalLatitude = {
						$between: [bounds.getSouth(), bounds.getNorth()]
					}

				}

				var results = query ? Locality.query(q).$promise : [];

				return results;
			},
			
			querySearchTaxon : function(query, onlyHigherTaxa) {

				var RankID;
				
				 if (typeof onlyHigherTaxa === 'boolean') {
				 	RankID = (onlyHigherTaxa) ? {
					lt: 5000
				} : {
					gt: 4999
				};
				 } else if(onlyHigherTaxa){
					 RankID: onlyHigherTaxa
				 }

				var q = {

					limit: 30,

					include: [{
						model: "Taxon",
						as: 'acceptedTaxon',
						include: JSON.stringify({
						model: "TaxonAttributes",
						as: "attributes",
						attributes: ["PresentInDK"],
						where: JSON.stringify({})
					})

					}, {
						model: "TaxonDKnames",
						as: "Vernacularname_DK"
					},
					{
																model: "TaxonDKnames",
																as: "DanishNames"
															}]
				};

				var parts = query.split(' ');


				q.where = {
					RankID: RankID,
					$or: [{
						FullName: {
							like: "%" + query + "%"
						}
					}, {
						"$DanishNames.vernacularname_dk$": {
							like: "%" + query + "%"
						}
					}]
				};
				q.order = "RankID ASC, probability DESC, FullName ASC"

				if (parts.length > 1) {
					q.where.$or.push({
						FullName: {
							like: parts[0] + "%"
						},
						TaxonName: {
							like: parts[1] + "%"
						}
					})
				}

				var results = query ? Taxon.query({
					nocount: true,
					where: JSON.stringify(q.where),
					include: JSON.stringify(q.include),
					order: q.order

				}).$promise : [];

				return results;

			},

			querySearchPlantTaxon :function(query) {


				var results = query ? PlantTaxon.query({
					where: {
						$or: [{
							DKname: {
								like: query + "%"
							}
						}, {
							LatinName: {
								like: query + "%"
							}
						}]
						

					},
					limit: 30,
					order: "probability DESC"
				}).$promise : [];

				return results;

			},

			querySearchGBIFPlantTaxon : function(query, rank) {


				var results = query ? $http({
					method: 'GET',
					url: 'http://api.gbif.org/v1/species/suggest',
					params: {
						datasetKey: '046bbc50-cae2-47ff-aa43-729fbf53f7c5',
						q: query,
						rank: rank
					}
				}).then(function(res) {
					return res.data;
				}) : [];

				return results;

			},

			querySearchUser : function(query) {

				var results = query ? User.query({
					where: {
						$or: [{
							name: {
								like: query + "%"
							}
						}, {
							Initialer: {
								like: query + "%"
							}
						}]

					},
					limit: 30
				}).$promise : [];

				return results;

			}
		}
			
			})