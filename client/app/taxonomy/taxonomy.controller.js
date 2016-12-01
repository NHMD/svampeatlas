'use strict';

angular.module('svampeatlasApp')
	.controller('TaxonomyCtrl', ['$scope', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'MycokeyCharacters', 'TaxonBatchUpdateModalService',
		function($scope, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, MycokeyCharacters, TaxonBatchUpdateModalService) {
			$scope.translate = $translate;
			$scope.resetSearch = function() {
				localStorage.removeItem('taxonomy_attribute_conditions');
				localStorage.removeItem('taxonomy_selected_higher_taxa');
				localStorage.removeItem('taxonomy_higher_taxa_predicate')
				localStorage.removeItem('taxonomy_selected_tags');
				localStorage.removeItem('taxonomy_redlist_categories');
				localStorage.removeItem('taxonomy_search_checkboxes');
				localStorage.removeItem("taxon_search_table");
				localStorage.removeItem('taxonomy_selected_mycokeycharacters');
				localStorage.removeItem('taxonomy_statistics_conditions');
				$("input[st-search]").val("");
				$scope.InitialzeSavedSettings();
				$timeout(function() {
						$("#reset-table-state").trigger('click');
					})
					//$scope.callServerSafe();

			};

			$scope.taxonattributes = Datamodel.get({
				id: 'TaxonAttributes'
			});

			$scope.taxonStatistics = Datamodel.get({
				id: 'TaxonStatistics'
			});

			$scope.InitialzeSavedSettings = function() {

				$scope.displayed = [];

				$scope.attributequery = {
					dateValue: new Date()
				};

				$scope.statisticsquery = {
					dateValue: new Date()
				};
				$scope.redlistCategories = TaxonRedListData.getCategories();

				var attConds = localStorage.getItem('taxonomy_attribute_conditions');
				$scope.attributeConditions = (attConds) ? JSON.parse(attConds) : [];

				var statConds = localStorage.getItem('taxonomy_statistics_conditions');
				$scope.statisticsConditions = (statConds) ? JSON.parse(statConds) : [];

				var higherTaxa = localStorage.getItem('taxonomy_selected_higher_taxa');
				$scope.selectedHigherTaxa = (higherTaxa) ? JSON.parse(higherTaxa) : [];

				var tags = localStorage.getItem('taxonomy_selected_tags');
				$scope.selectedTags = (tags) ? JSON.parse(tags) : [];

				var mycokeyCharacters = localStorage.getItem('taxonomy_selected_mycokeycharacters');
				$scope.selectedMycokeyCharacters = (mycokeyCharacters) ? JSON.parse(mycokeyCharacters) : [];

				var redListCategories = localStorage.getItem('taxonomy_redlist_categories');
				$scope.selectedRedListCategories = (redListCategories) ? JSON.parse(redListCategories) : {};

				var localStCheckBoxes = localStorage.getItem('taxonomy_search_checkboxes');
				$scope.checkboxes = (localStCheckBoxes) ? JSON.parse(localStCheckBoxes) : {};

				$scope.extendedSearchIsOn = ($scope.selectedHigherTaxa.length > 0 || $scope.attributeConditions.length > 0 || $scope.statisticsConditions.length > 0 || $scope.selectedTags.length > 0) ? 0 : -1;

			};
			$scope.InitialzeSavedSettings();

			$scope.$watch('selectedRedListCategories', function(newval, oldval) {

				if (!_.isEmpty(newval)) {
					if (!newval.year) {
						newval.year = $scope.redlistCategories[0].year;
					}
					localStorage.setItem('taxonomy_redlist_categories', JSON.stringify(newval));
					$scope.callServerSafe();
				}

			}, true);

			$scope.getOperators = function(type) {

				if (type === 'text') {
					return ['contains', 'starts with'];
				} else if (type === 'number' || type === 'date') {
					return ['equals', 'greater than', 'less than']
				} else if (type === 'boolean') {
					return ['equals']
				}

			}

			$scope.getAttributeType = function(attr, attList) {
				if (!attr || !attList) return undefined;
				var type = (attList[attr]) ? attList[attr].type : undefined;
				if (!type) {
					return undefined;
				}
				if (type === "BIT(1)" || type === "TINYINT(1)") {
					return 'boolean';
				} else if (type === "DATETIME" || type === "TIMESTAMP") {
					return 'date';
				} else if (type && type.indexOf('INT') > -1) {
					return 'number'
				} else {
					return 'text'
				}
			};

			$scope.attributeQueryIsValid = function(q) {
				return q.selectedAttribute !== undefined && q.selectedOperator !== undefined && q.value !== undefined;
			}


			$scope.addCondition = function(q, conditions, localStorageKey) {
				var cond = {};
				if (q.selectedOperator === "contains") {

					cond[q.selectedAttribute] = {
						$like: '%' + q.value + '%'
					};

				} else if (q.selectedOperator === "starts with") {
					cond[q.selectedAttribute] = {
						$like: q.value + '%'
					}
				} else if (q.selectedOperator === "equals") {
					cond[q.selectedAttribute] = {
						$eq: q.value
					}
				} else if (q.selectedOperator === "greater than") {
					cond[q.selectedAttribute] = {
						$gt: q.value
					}
				} else if (q.selectedOperator === "less than") {
					cond[q.selectedAttribute] = {
						$lt: q.value
					}
				}
				conditions.push({
					readable: q.selectedAttribute + " " + q.selectedOperator + " " + "'" + q.value + "'",
					dbquery: cond
				});
				localStorage.setItem(localStorageKey, JSON.stringify(conditions))
				$scope.callServerSafe();
				q = {
					dateValue: new Date()
				};
			}


			$scope.$watch('attributequery.selectedAttribute', function(newval, oldval) {
				if (newval && newval !== oldval) {
					$scope.operators = $scope.getOperators($scope.getAttributeType(newval, $scope.taxonattributes))
				}
				if ($scope.getAttributeType(newval) === 'boolean') {
					$scope.attributequery.selectedOperator = 'equals';
				}
			});

			$scope.$watch('statisticsquery.selectedAttribute', function(newval, oldval) {
				if (newval && newval !== oldval) {
					$scope.statisticsoperators = $scope.getOperators($scope.getAttributeType(newval, $scope.taxonStatistics))
				}
				if ($scope.getAttributeType(newval) === 'boolean') {
					$scope.statisticsquery.selectedOperator = 'equals';
				}
			});



			$scope.tagSearch = function(query) {

				var results = query ? TaxonomyTags.query({
					where: {
						tagname: {
							like: query + "%"
						}
					},
					limit: 30
				}).$promise : [];

				return results;
			}

			$scope.mycokeySearch = function(query) {

				var where = ($translate.use() === "en") ? {
					"description UK": {
						like: "%" + query + "%"
					}
				} : {
					"description DK": {
						like: "%" + query + "%"
					}
				};

				var results = query ? MycokeyCharacters.query({
					where: where,
					limit: 30
				}).$promise : [];

				return results;
			}


			$scope.$watchCollection('selectedTags', function(newVal, oldVal) {


				localStorage.setItem('taxonomy_selected_tags', JSON.stringify($scope.selectedTags))

				$scope.callServerSafe();

			})

			$scope.$watchCollection('selectedMycokeyCharacters', function(newVal, oldVal) {


				localStorage.setItem('taxonomy_selected_mycokeycharacters', JSON.stringify($scope.selectedMycokeyCharacters))

				$scope.callServerSafe();

			})


			$scope.querySearch = function(query) {

				var results = query ? Taxon.query({
					where: {
						TaxonName: {
							like: query + "%"
						},
						RankID: {
							lt: 10000
						}
					},
					limit: 30

				}).$promise : [];

				return results;
			}



			$scope.$watchCollection('selectedHigherTaxa', function(newVal, oldVal) {


				var higherTaxaAggregate = {
					$or: []
				};
				if (newVal.length > 0) {
					higherTaxaAggregate.RankID = {
						$gt: 9999
					};
				}
				angular.forEach(newVal, function(tx) {
					higherTaxaAggregate.$or.push({
						Path: {
							like: tx.Path + "%"
						}
					})
				})

				localStorage.setItem('taxonomy_higher_taxa_predicate', JSON.stringify(higherTaxaAggregate));


				localStorage.setItem('taxonomy_selected_higher_taxa', JSON.stringify($scope.selectedHigherTaxa))
				$scope.callServerSafe();

			})

			$scope.$watchCollection('attributeConditions', function(newVal, oldVal) {

				if (newVal) {
					localStorage.setItem('taxonomy_attribute_conditions', JSON.stringify(newVal));
					$scope.callServerSafe();
				}

			});

			$scope.$watchCollection('statisticsConditions', function(newVal, oldVal) {

				if (newVal) {
					localStorage.setItem('taxonomy_statistics_conditions', JSON.stringify(newVal));
					$scope.callServerSafe();
				}

			});


			$scope.$watch('checkboxes.acceptedTaxaOnly', function(newVal, oldVal) {

				if (newVal !== oldVal) {
					$scope.saveStateAndTriggerSearchFromCheckboxes();
				}

			})
			$scope.$watch('checkboxes.PresentInDK', function(newVal, oldVal) {

				if (newVal !== oldVal) {
					$scope.saveStateAndTriggerSearchFromCheckboxes();
				}
			});

			$scope.$watch('checkboxes.OrphantTaxa', function(newVal, oldVal) {

				if (newVal !== oldVal) {
					if (newVal === true) {
						$scope.selectedHigherTaxa = [];
					};

					$scope.saveStateAndTriggerSearchFromCheckboxes();
				}

			})
			$scope.saveStateAndTriggerSearchFromCheckboxes = function() {
				localStorage.setItem('taxonomy_search_checkboxes', JSON.stringify($scope.checkboxes))
				$scope.callServerSafe();
			}

			$scope.callServerSafe = function() {

					var tableState = localStorage.taxon_search_table;
					var state = (tableState) ? JSON.parse(tableState) : {
						"sort": {},
						"search": {
							"predicateObject": {}
						},
						"pagination": {}
					};
					$scope.callServer(state);

				}
				//************************************************************


			$scope.markedForUpdate = [];
			$scope.toggleForUpdate = function(item, list) {
				var idx = list.indexOf(item);
				if (idx > -1) {
					list.splice(idx, 1);
				} else {
					list.push(item);
				}
			};
			$scope.existsInMarkedForUpdate = function(item, list) {
				return list.indexOf(item) > -1;
			};
			$scope.isIndeterminate = function() {
				return ($scope.markedForUpdate.length !== 0 &&
					$scope.markedForUpdate.length !== $scope.displayed.length);
			};
			$scope.allAreChecked = function() {
				return $scope.markedForUpdate.length === $scope.displayed.length;
			};
			$scope.toggleAllForUpdate = function() {
				if ($scope.markedForUpdate.length === $scope.displayed.length) {
					$scope.markedForUpdate = [];
				} else if ($scope.markedForUpdate.length === 0 || $scope.markedForUpdate.length > 0) {
					$scope.markedForUpdate = $scope.displayed.slice(0);
				}
			};

			$scope.doBatch = function() {


				if ($scope.markedForUpdate.length === 0) {
					alert('Du skal markere nogle taxa i tabellen.')
				} else {



					TaxonBatchUpdateModalService.show($scope.markedForUpdate);

				}

			};







			//************************************

			$scope.callServer = function(tableState) {



				var pagination = tableState.pagination;

				var offset = pagination.start || 0; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
				var limit = pagination.number || 50; // Number of entries showed per page.
				var where = (tableState.search.predicateObject) ? _.mapValues(_.omit(tableState.search.predicateObject, ['Vernacularname_DK']), function(value, key) {
					return {
						like: value += "%"
					};

				}) : undefined;

				var higerTaxaPredicate = localStorage.getItem('taxonomy_higher_taxa_predicate');

				if (higerTaxaPredicate && where) {
					_.merge(where, JSON.parse(higerTaxaPredicate))
				} else if (!where) {
					where = JSON.parse(higerTaxaPredicate);
				}

				if (!where) {}

				if (where && $scope.checkboxes.OrphantTaxa) {
					_.merge(where, {
						parent_id: null
					});
				} else if ($scope.checkboxes.OrphantTaxa) {
					where = {
						parent_id: null
					}
				};

				var order = tableState.sort.predicate;
				if (tableState.sort.reverse) {
					order += " DESC"
				};

				var query = {
					order: order,
					offset: offset,
					limit: limit
				};
				if (where) {
					query['where'] = JSON.stringify(where)
				};

				var attributesWhere = (tableState.search.predicateObject && tableState.search.predicateObject.attributes) ? _.mapValues(tableState.search.predicateObject.attributes, function(value, key) {


					return {
						like: "%" + value + "%"
					};
				}) : undefined;



				if ($scope.checkboxes.PresentInDK === true) {

					attributesWhere = _.merge({}, attributesWhere, {
						PresentInDK: true
					});
				};
				var attConds = localStorage.getItem('taxonomy_attribute_conditions');

				if (attConds) {
					var parsedConds = JSON.parse(attConds);
					if (!attributesWhere) {
						attributesWhere = {};

					};
					attributesWhere.$and = _.map(parsedConds, function(c) {
						return JSON.stringify(c.dbquery)
					});

				}







				var dkNameWhere = (tableState.search.predicateObject && tableState.search.predicateObject.Vernacularname_DK) ? _.mapValues(tableState.search.predicateObject.Vernacularname_DK, function(value, key) {


					return {
						like: "%" + value + "%"
					};
				}) : undefined;

				var include = [{
						model: "TaxonAttributes",
						as: "attributes",
						where: JSON.stringify(attributesWhere)
					},

					{
						model: "TaxonDKnames",
						as: "Vernacularname_DK",
						where: JSON.stringify(dkNameWhere)
					}
				];

				var storedTags = localStorage.getItem('taxonomy_selected_tags');

				if (storedTags) {


					var parsedTags = JSON.parse(storedTags);

					for (var i = 0; i < parsedTags.length; i++) {

						include.push({
							model: "TaxonomyTagView",
							as: "tags" + i,
							where: JSON.stringify({
								tag_id: parsedTags[i]._id
							})
						})

					}


				}


				var storedMycokeyCharacters = localStorage.getItem('taxonomy_selected_mycokeycharacters');

				if (storedMycokeyCharacters) {


					var parsedCharacters = JSON.parse(storedMycokeyCharacters);

					for (var i = 0; i < parsedCharacters.length; i++) {

						include.push({
							model: "MycokeyCharacterView",
							as: "character" + i,
							where: JSON.stringify({
								CharacterID: parsedCharacters[i].CharacterID
							})
						})

					}


				}

				var storedRedListCategories = localStorage.getItem('taxonomy_redlist_categories');
				if (storedRedListCategories) {
					var parsedRedListCategories = JSON.parse(storedRedListCategories);
					var rlInculde = {
						model: "TaxonRedListData",
						as: "redlistdata",
						where: {
							status: []
						}
					};

					angular.forEach(parsedRedListCategories, function(val, key) {
						if (val === true) {
							rlInculde.where.status.push(key);
						}
					});

					if (rlInculde.where.status.length > 0) {
						rlInculde.where.year = parsedRedListCategories.year;
						rlInculde.where = JSON.stringify(rlInculde.where)
						include.push(rlInculde);
					}


				}


				var statConds = localStorage.getItem('taxonomy_statistics_conditions');

				if (statConds) {
					var parsedConds = JSON.parse(statConds);
					if (parsedConds.length === 1) {
						include.push({
							model: "TaxonStatistics",
							as: "Statistics",
							where: JSON.stringify(parsedConds[0].dbquery)
						})
					} else if (parsedConds.length > 1) {
						var and = _.map(parsedConds, function(c) {
							return JSON.stringify(c.dbquery)
						});

						include.push({
							model: "TaxonStatistics",
							as: "Statistics",
							where: JSON.stringify({
								$and: and
							})
						})

					}

				}



				if ($scope.checkboxes.acceptedTaxaOnly === true) {
					query.acceptedTaxaOnly = true;
				}


				query.include = JSON.stringify(include);
				Taxon.query(query, function(result, headers) {

					$scope.taxonCount = headers('count');

					var numPages = Math.ceil(headers('count') / limit);
					tableState.pagination.numberOfPages = numPages; //set the number of pages so the pagination can update
					tableState.pagination.totalItemCount = headers('count');
					localStorage.setItem("taxon_search_table", JSON.stringify(tableState));

					$scope.paginationPages = (tableState.pagination.numberOfPages < 5) ? tableState.pagination.numberOfPages : 5;


					$scope.displayed = result;
					$scope.isLoading = false;
				});
			};



		}
	])

.directive('stRatio', function() {
	return {
		link: function(scope, element, attr) {
			var ratio = +(attr.stRatio);

			element.css('width', ratio + '%');

		}
	};
});;
