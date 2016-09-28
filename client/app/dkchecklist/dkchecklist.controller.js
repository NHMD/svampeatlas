'use strict';

angular.module('svampeatlasApp')
	.controller('DkCheckListCtrl', ['$scope', 'Auth', 'Taxon', '$timeout', '$q', '$translate', 'TaxonomyTags', '$mdMedia', '$mdDialog', '$stateParams', '$state',
		function($scope, Auth, Taxon, $timeout, $q, $translate, TaxonomyTags, $mdMedia, $mdDialog, $stateParams, $state) {

			$scope.Auth = Auth;
			$scope.stItemsPrPage = 100;
			$scope.$state = $state;
			$scope.mdMedia = $mdMedia;
			var storedState = localStorage.getItem('dkchecklist_table');
			var parsedStoredState = (storedState) ? JSON.parse(storedState) : undefined;
			if(parsedStoredState && parsedStoredState.search && parsedStoredState.search.predicateObject && parsedStoredState.search.predicateObject.FullName){
				$scope.uiFullName = parsedStoredState.search.predicateObject.FullName;
			}
			if(parsedStoredState && parsedStoredState.search && parsedStoredState.search.predicateObject && parsedStoredState.search.predicateObject.Vernacularname_DK){
				$scope.uiDkName = parsedStoredState.search.predicateObject.Vernacularname_DK.vernacularname_dk;
			}

			$scope.showRecords = function(taxon_id, resulttype) {
				$state.go('search-' + resulttype, {
					taxon_id: taxon_id
				})
			}

			
			$scope.query = {
				acceptedTaxaOnly: true,
				include: [{
					"model": "TaxonRedListData",
					"as": "redlistdata",
					required: false,
					"attributes": ['status'],
					where: JSON.stringify({
						year: 2009
					})
				}, {
					"model": "TaxonAttributes",
					"as": "attributes",
					"attributes": ['PresentInDK'],
					"where": JSON.stringify({
						PresentInDK: true
					})
				}, {
					"model": "TaxonDKnames",
					"as": "Vernacularname_DK"
				}, {
					"model": "Taxon",
					"as": "synonyms"
				}],


			}



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

				var where = (tableState.search.predicateObject) ? _.mapValues(_.omit(tableState.search.predicateObject, ['Vernacularname_DK', 'synonyms']), function(value, key) {

					return {
						like: "%" +value + "%"
					};

				}) : undefined;

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

				var dkNameWhere = (tableState.search.predicateObject && tableState.search.predicateObject.Vernacularname_DK) ? _.mapValues(tableState.search.predicateObject.Vernacularname_DK, function(value, key) {


					return {
						like: "%" + value + "%"
					};
				}) : undefined;

				if(dkNameWhere){
					query.include[2].where = JSON.stringify(dkNameWhere)
				}
				

				var order = tableState.sort.predicate;
				if (tableState.sort.reverse) {
					order += " DESC"
				};
				//var geometry = ObservationSearchService.getSearch().geometry;
				
				query.include = JSON.stringify(query.include)
				query.offset = offset;
				query.limit = limit;
				query.order = order;
				query.where = where;




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
