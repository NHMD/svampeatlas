'use strict';

angular.module('svampeatlasApp')
	.controller('DkCheckListCtrl', ['$scope', 'Auth', 'Taxon', '$timeout', '$q', '$translate', 'TaxonomyTags', '$mdMedia', '$mdDialog', '$stateParams', '$state','SearchService',
		function($scope, Auth, Taxon, $timeout, $q, $translate, TaxonomyTags, $mdMedia, $mdDialog, $stateParams, $state, SearchService) {
			var that = this;
			$scope.$translate = $translate;
			var storedState = localStorage.getItem('dkchecklist_table_search');
			if(storedState){
			$scope.search =	JSON.parse(storedState) 
			} else {
				$scope.search = {};
				$scope.search.selectedHigherTaxa = [];
				$scope.search.selectedMorphoGroup = [];	
			}
			
			$scope.querySearch = function(query) {
				return SearchService.querySearchTaxon(query, false)
			}
			SearchService.getMorphoGroup().then(function(morphoGroup){
				$scope.morphoGroup = morphoGroup;
						
			})
			$scope.findMorphoGroup = function(searchText){
				if(searchText === "*"){
					return $scope.morphoGroup;
				} else {
					return _.filter($scope.morphoGroup, function(g){
						return g.name_dk.indexOf(searchText) > -1;
					})
				}
		
			}
			
			$scope.Auth = Auth;
			$scope.stItemsPrPage = 100;
			$scope.$state = $state;
			$scope.mdMedia = $mdMedia;
			$scope.letters = "abcdefghijklmnopqrstuvwxyzæøå".toUpperCase().split("");
			
			if ($stateParams.indexLetter) {
				$scope.search.indexLetter = $stateParams.indexLetter;
			}
			$scope.$watch('search.indexLetter', function(newVal, oldVal){
				if(newVal && newVal !== oldVal){
					if(newVal ==="any"){
						$state.go($state.current, {indexLetter: undefined})
					} else {
						$state.go($state.current, {indexLetter: newVal})
					}
					
				} 
			})
			
			
			$scope.query  = {
				where: { $or: [] },
				include: [{
					"model": "TaxonRedListData",
					"as": "redlistdata",
					required: false,
					"attributes": ['status'],
					where: JSON.stringify({
						year: 2009
					})
				}, {
					"model": "Taxon",
					"as": "acceptedTaxon",
					include: [JSON.stringify({
					"model": "TaxonAttributes",
					"as": "attributes",
					"attributes": ['PresentInDK'],
					"where": JSON.stringify({
						PresentInDK: true
					})
				})]
				} , {
					"model": "TaxonDKnames",
					"as": "Vernacularname_DK"
				}, {
					"model": "Taxon",
					"as": "synonyms"
				},{
					"model": "TaxonStatistics",
					"as": "Statistics"
				}]


			};

			$scope.showRecords = function(taxon_id, resulttype) {
				$state.go('search-' + resulttype, {
					taxon_id: taxon_id
				})
			}
			
			$scope.acceptedTaxaOnly = true;
			


			$scope.$watch('search', function(newVal, oldVal) {
				 // if there is a search id delete it (will be set after 100 millisec when a stored search is selected or created)
				if(newVal.redliststatus){
					$scope.query.include[0].where = JSON.stringify({
						year: 2009,
						status: newVal.redliststatus
					})
					$scope.query.include[0].required = true
				} else {
					$scope.query.include[0].where = JSON.stringify({
											year: 2009
										});
										$scope.query.include[0].required = false;
				}
				if (newVal.selectedHigherTaxa.length === 0 && newVal.selectedMorphoGroup.length === 0){
					delete $scope.query.where.$or;
				} else {
					$scope.query.where.$or = []
				}
				
				if (newVal.selectedHigherTaxa.length > 0) {
					  _.each(newVal.selectedHigherTaxa, function(tx) {

						// its a taxon resource
						if(tx.Path && tx._id){
							var path = (!tx.acceptedTaxon) ? tx.Path : tx.acceptedTaxon.Path;
							$scope.query.where.$or.push({
								Path: {
									like: path + "%"
								}
							})
						} 
						 

					})
				} 
				
				if (newVal.selectedMorphoGroup.length > 0) {
					 _.each(newVal.selectedMorphoGroup, function(mg) {

						
					$scope.query.where.$or.push({morphogroup_id: mg._id})
						 

					})
				} 
				
				
				
				localStorage.setItem('dkchecklist_table_search', JSON.stringify($scope.search))
				
				$timeout(function() {
						$("#reset-table-state").trigger('click');
					})
				

			}, true)


			

			$scope.callServer = function(tableState) {
				var query = angular.copy($scope.query);
				if ($scope.count && $scope.count < tableState.pagination.start) {
					return false;
				}
				$scope.isLoading = true;

				var pagination = tableState.pagination;

				var offset = pagination.start || 0; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
				var limit = pagination.number || 500; // Number of entries showed per page.

				offset = parseInt(offset);
				limit = parseInt(limit)

				var where = (tableState.search.predicateObject) ? _.merge(query.where, _.mapValues(_.omit(tableState.search.predicateObject, ['Vernacularname_DK', 'synonyms', 'indexLetter']), function(value, key) {
					 
	
					 
					return {
						like: "%" +value + "%"
					};

				})) : undefined;

				if (!where) {
					where = {
						RankID: {
							gt: 5000
						}
					}
				} else {
					_.merge(where, {
						RankID: {
							gt: 5000
						}
					});
				};
				
				if($scope.search.indexLetter){
					if(where.FullName){
						where.FullName = { $and: [ where.FullName, {
						like: $scope.search.indexLetter + "%"
					}]
					}
				} else {
					where.FullName = {
						like: $scope.search.indexLetter + "%"
					}
				}
			}
				
			if($scope.uiDkName === "*"){
				query.include[2].required = true;
			} else {
				var dkNameWhere = (tableState.search.predicateObject && tableState.search.predicateObject.Vernacularname_DK) ? _.mapValues(tableState.search.predicateObject.Vernacularname_DK, function(value, key) {


					return {
						like: "%" + value + "%"
					};
				}) : undefined;

				if(dkNameWhere){
					query.include[2].where = JSON.stringify(dkNameWhere)
				}
			}

				var order = tableState.sort.predicate;
				var _order = [[order]];
				if (tableState.sort.reverse) {
					order += " DESC";
					_order[0].push("DESC");
				};
				
				//var geometry = ObservationSearchService.getSearch().geometry;
				
				query.include = JSON.stringify(query.include)
				query.offset = offset;
				query.limit = limit;
				query._order = _order;
				query.where = where;
				
				if($scope.acceptedTaxaOnly === true){
					query.acceptedTaxaOnly = $scope.acceptedTaxaOnly;
					
				}

				Taxon.query(query, function(result, headers) {

					$scope.taxonCount = headers('count');

					var numPages = Math.ceil(headers('count') / limit);
					tableState.pagination.numberOfPages = numPages; //set the number of pages so the pagination can update
					tableState.pagination.totalItemCount = headers('count');


					$scope.paginationPages = (tableState.pagination.numberOfPages < 5) ? tableState.pagination.numberOfPages : 5;
					$scope.fromRecord = offset + 1;

					$scope.toRecord = (tableState.pagination.totalItemCount < (offset + limit)) ? tableState.pagination.totalItemCount : (offset + limit);


					$scope.displayed = result;
					$scope.isLoading = false;
				});

			};



		}
	]);
