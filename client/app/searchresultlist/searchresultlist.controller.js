'use strict';

angular.module('svampeatlasApp')
	.controller('SearchListCtrl', ['$scope','$filter', 'Auth', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'Observation', '$mdMedia', '$mdDialog', 'ObservationSearchService', '$stateParams', '$state', 'ObservationModalService', 'ObservationFormService','ErrorHandlingService', 'Determination',
		function($scope,$filter, Auth, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService, $stateParams, $state, ObservationModalService, ObservationFormService, ErrorHandlingService, Determination) {
			
			$scope.moment = moment;
			$scope.Auth = Auth;
			$scope.currentUser = Auth.getCurrentUser();
			$scope.stItemsPrPage = 100;
			$scope.ObservationModalService = ObservationModalService;
			$scope.$state = $state;
			$scope.ObservationFormService = ObservationFormService;
			$scope.$stateParams = $stateParams;
			
			if ($stateParams.searchterm || ($stateParams.locality_id && $stateParams.date) || $stateParams.taxon_id) {
				ObservationSearchService.reset();
				var search = ObservationSearchService.getSearch();
				search.wasInitiatedOutsideSearchForm = true;
				search.where = {};
				
				if ($stateParams.searchterm === "mine") {

					search.include[1].where = {
						_id: Auth.getCurrentUser()._id
					} 
					search.include[1].required = true;
					// include foreign
					search.include[2].required = false;

				} else if ($stateParams.searchterm === "3days") {

					search.where.observationDate = {
						gt: $filter('date')(moment().subtract(3, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}
				} else if ($stateParams.searchterm === "7days") {

					search.where.observationDate = {
						gt: $filter('date')(moment().subtract(7, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}

				} else if($stateParams.locality_id && $stateParams.date){
					search.where.observationDate = {
						
						gt: $filter('date')(moment($stateParams.date).toDate()	, "yyyy-MM-dd", '+0200')				
					};
					search.where.locality_id = $stateParams.locality_id;
			} else if($stateParams.taxon_id ){
				search.include[0].where.Taxon_id = $stateParams.taxon_id;
				
				
				search.include[0].where.Determination_validation = ['Godkendt','Valideres', 'Afventer', 'Gammelvali'];
					
			};

			}
			$scope.getCreatedAt = function(createdAt){
				return moment(createdAt).fromNow();
			}
			
			$scope.getDate = function(observationDate, observationDateAccuracy) {

				var splitted = observationDate.split(" ")[0].split("-");

				if (observationDateAccuracy === 'month') {
					//console.log("spl "+parseInt(splitted[1]))
					return moment.months()[parseInt(splitted[1]) - 1] + " " + splitted[0];
				} else if (observationDateAccuracy === 'year') {
					return splitted[0];
				} else if (observationDateAccuracy === 'invalid') {
					return "ingen dato"
				}

			}

			$scope.search = ObservationSearchService.getSearch();

			if (_.isEmpty($scope.search)) {
				$state.go('search')
			};
			// if we came directly from the map view, remove images and forum from include
			/*
			$scope.search.include = $scope.search.include.slice(0, 5);
			$scope.search.include[0].attributes = ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName', 'Determination_user_id'],
			$scope.search.include[1].attributes = [ 'Initialer', 'name'];
			$scope.search.include.push({
				model: "ObservationImage",
				as: 'Images',
				separate: true,
				offset: 0,
				limit: 1
			});

			$scope.search.include.push({
				model: "ObservationForum",
				as: 'Forum',
				separate: true,
				offset: 0,
				limit: 1

			});
			*/
			
			$scope.queryinclude = _.map($scope.search.include, function(n) {
				return JSON.stringify(n);
			});





			$scope.mdMedia = $mdMedia;


			$scope.callServer = function(tableState) {
				if ($scope.count && $scope.count < tableState.pagination.start) {
					return false;
				}
				$scope.isLoading = true;

				var pagination = tableState.pagination;

				var offset = pagination.start || 0; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
				var limit = pagination.number || 500; // Number of entries showed per page.

				offset = parseInt(offset);
				limit = parseInt(limit)


				console.log("offset " + offset)
				console.log("count " + $scope.count)
				/*
				if (!tableState.sort.predicate) {
					tableState.sort.predicate = 'observationDate';
					tableState.sort.reverse = true;
				} */
				/*
				var order = tableState.sort.predicate;
				if (tableState.sort.reverse) {
					order += " DESC"
				};
				*/
				var order = (tableState.sort.predicate) ? [[tableState.sort.predicate]] : [['observationDate', 'DESC'], ['_id', 'DESC']];
								if (tableState.sort.reverse && tableState.sort.predicate) {
									order[0].push("DESC");
								} else {
									order[0].push("ASC");
								};
				
				var geometry = ObservationSearchService.getSearch().geometry;
				var query = {
					//order: order || 'observationDate DESC',
					_order: JSON.stringify(order),
					offset: offset,
					limit: limit,
					activeThreadsOnly: ObservationSearchService.getSearch().activeThreadsOnly,
					recentlyCommented: ObservationSearchService.getSearch().recentlyCommented,
					selectedMonths: ObservationSearchService.getSearch().selectedMonths,
					where: ObservationSearchService.getSearch().where || {},
					include: JSON.stringify($scope.queryinclude)
				};

				if (geometry) {
					query.geometry = geometry;
				}



				function showTooltip(elem, msg) {
				    elem.setAttribute('class', 'clipboard-copy tooltipped tooltipped-s');
				    elem.setAttribute('aria-label', msg);
				}
				function fallbackMessage(action) {
				    var actionMsg = '';
				    var actionKey = (action === 'cut' ? 'X' : 'C');
				    if (/iPhone|iPad/i.test(navigator.userAgent)) {
				        actionMsg = 'No support for copying:(';
				    } else if (/Mac/i.test(navigator.userAgent)) {
				        actionMsg = 'Press ⌘-' + actionKey + ' to ' + action;
				    } else {
				        actionMsg = 'Press Ctrl-' + actionKey + ' to ' + action;
				    }
				    return actionMsg;
				}
				
				$scope.updateValidation = function(row, validation){
					
					
					
					Determination.updateValidation({id: row.primarydetermination_id}, {validation: 'Godkendt'}).$promise
					.then(function(determination){
						row.DeterminationView.Determination_validation = 'Godkendt'
						
						//var txt = (determination.validation === "Afventer") ? "Bestemmelse afventer" : ("Fundet er "+determination.validation);
						//$scope.showSimpleToast(txt)
					})
					.catch(function(err){
						
						ErrorHandlingService.handle500();
					})
					
				}


				Observation.query(query, function(result, headers) {

					//$scope.taxonCount = headers('count');

					var numPages = Math.ceil(parseInt(headers('count')) / limit);
					tableState.pagination.numberOfPages = numPages; //set the number of pages so the pagination can update
					tableState.pagination.totalItemCount = parseInt(headers('count'));

					$scope.paginationPages = (tableState.pagination.numberOfPages < 5) ? tableState.pagination.numberOfPages : 5;

					$scope.fromRecord = offset + 1;

					$scope.toRecord = (tableState.pagination.totalItemCount < (offset + limit)) ? tableState.pagination.totalItemCount : (offset + limit);

					$scope.displayed = result;
					$scope.isLoading = false;
					var clipboard = new Clipboard('.clipboard-copy');
					clipboard.on('success', function(e) {
					    e.clearSelection();
					    console.info('Action:', e.action);
					    console.info('Text:', e.text);
					    console.info('Trigger:', e.trigger);
					    showTooltip(e.trigger, 'Copied!');
					});
					clipboard.on('error', function(e) {
					    console.error('Action:', e.action);
					    console.error('Trigger:', e.trigger);
					    showTooltip(e.trigger, fallbackMessage(e.action));
					});
				}, function(err){
					console.log(err, status)
					
					if(err.status === 504) {
						ErrorHandlingService.handle504();
					}
					if(err.status === 500) {
						ErrorHandlingService.handle500();
					}
				});

			};



		}
	]);
