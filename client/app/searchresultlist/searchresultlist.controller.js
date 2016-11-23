'use strict';

angular.module('svampeatlasApp')
	.controller('SearchListCtrl', ['$scope', '$rootScope', '$filter', 'Auth', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'Observation', '$mdMedia', '$mdDialog', 'ObservationSearchService', 'ObservationStateService', '$stateParams', '$state', 'ObservationModalService', 'ObservationFormService', 'ErrorHandlingService', 'Determination', '$cookies', 'appConstants',
		function($scope, $rootScope, $filter, Auth, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService, ObservationStateService, $stateParams, $state, ObservationModalService, ObservationFormService, ErrorHandlingService, Determination, $cookies, appConstants) {

			$scope.moment = moment;
			$scope.Auth = Auth;
			$scope.currentUser = Auth.getCurrentUser();
			$scope.stItemsPrPage = 100;
			$scope.ObservationModalService = ObservationModalService;
			$scope.$state = $state;
			$scope.ObservationFormService = ObservationFormService;
			$scope.$stateParams = $stateParams;
			
			
			// Only use table state for correct pagination when a row update has occurred - otherwise delete state 
			if (!ObservationStateService.updated){
				localStorage.removeItem('search_result_list_table');
			}
			
			
			
			var csvDeferred = $q.defer();
			$scope.csv = csvDeferred.promise;
			
			$scope.getObservationCsv = function(){
				
				$scope.csvInProgress = true;
				function getLocality(elm){
					if(elm.Locality){
						return elm.Locality.name
					} else if(elm.GeoNames){
						return elm.GeoNames.name
					}
				}
				
				function getCountry(elm){
					if(elm.Locality){
						return "Denmark"
					} else if(elm.GeoNames){
						return elm.GeoNames.countryName
					}
				}
				
				function getCollectors(elm){
					return _.reduce(elm.users, function(prev, user){
						return (prev === "") ? user.name : prev+", "+ user.name;
					}, "")
				}
				
				function getAssociatedTaxa(elm){
					return _.reduce(elm.associatedTaxa, function(prev, tx){
						return (prev === "") ? tx.DKandLatinName : prev+", "+ tx.DKandLatinName;
					}, "")
				}
				
				
				var csvsearch = angular.copy(ObservationSearchService.getSearch());
				csvsearch.include[0].include=JSON.stringify([JSON.stringify({model: 'User', as: "Determiner", required: false, where:{}})])
				csvsearch.include.push({model: "VegetationType", as :"VegetationType", where: {}, required: false})
				csvsearch.include.push({model: "Substrate", as :"Substrate", where: {}, required: false})
				csvsearch.include.push({model: "User", as :"users", where: {}, required: false})
				csvsearch.include.push({model: "PlantTaxon", as :"associatedTaxa", where: {}, required: false})
				
				
				
				
				
				
				var csvqueryinclude = _.map(csvsearch.include, function(n) {
					return JSON.stringify(n);
				});
				
				var geometry = csvsearch.geometry;
				var q = {
					//order: order || 'observationDate DESC',
					
					nocount: true,
					activeThreadsOnly: csvsearch.activeThreadsOnly,
					recentlyCommented: csvsearch.recentlyCommented,
					selectedMonths: csvsearch.selectedMonths,
					where: csvsearch.where || {},
					include: JSON.stringify(csvqueryinclude)
				};

				if (geometry) {
					q.geometry = geometry;
				}
				
				
			Observation.query(q)
				.$promise.then(function(result) {
					delete $scope.csvInProgress;
					var mapped =  _.map(result, function(e){
						return {
							_id: "DMS-"+e._id,
							observationDate: e.observationDate,
						//	createdDate: e.createdAt,
							validationStatus: e.DeterminationView.Determination_validation,
							taxon_id: e.DeterminationView.Taxon_id,
							taxonFullName: e.DeterminationView.Taxon_FullName,
							taxonDanishName: e.DeterminationView.Taxon_vernacularname_dk,
							taxonRedListCategory: e.DeterminationView.Taxon_redlist_status,
							locality: getLocality(e),
							country: getCountry(e),
							decimalLatitude: e.decimalLatitude,
							decimalLongitude: e.decimalLongitude,
							accuracy: e.accuracy,
							reportedBy: (e.PrimaryUser) ? e.PrimaryUser.name : "",
							substrate: (e.Substrate) ? e.Substrate.name : "",
							vegetationType: (e.VegetationType) ? e.VegetationType.name : "",
							associatedTaxa: getAssociatedTaxa(e),
							ecologyNotes: e.ecologynote,
							notes: e.note,
							leg: getCollectors(e),
							det: (e.DeterminationView.Determiner) ? e.DeterminationView.Determiner.name : "",
							URI: appConstants.baseurl +"/observations/"+e._id
						
						

						}
					})
					
					csvDeferred.resolve(mapped)
					
				})
				.catch(function(err){
					delete $scope.csvInProgress;
					ErrorHandlingService.handle500();
				});
				
				
				
				
				
				
				
			}

			

			$scope.$on('dialogRemoved', function(ev, obs) {


				//	$('#'+obs._id).addClass('row-updated');

				if (ObservationStateService.updated) {
					delete ObservationStateService.updated;
					var singleObsSearch = ObservationSearchService.getNewSearch();
					singleObsSearch.where = {
						_id: obs._id
					};
					singleObsSearch.include[2].required = false;
					var include = _.map(singleObsSearch.include, function(n) {
						return JSON.stringify(n);
					});

					Observation.query({
						where: {
							_id: obs._id
						},
						include: JSON.stringify(include)
					}, function(result, headers) {

						var index = _.indexOf($scope.displayed, _.find($scope.displayed, {
							_id: obs._id
						}));



						$scope.displayed[index] = result[0];
						$scope.displayed[index].isSelected = true;

						$timeout(function() {
							$('md-content').animate({
								scrollTop: $(".st-selected").offset().top - 100
							}, 300);

							$timeout(function() {
								delete $scope.displayed[index].isSelected;
							}, 3000)
						}, 0)



					})
				} 

			});



			$scope.$on('new_observation', function(ev, obs) {

				var singleObsSearch = ObservationSearchService.getNewSearch();
				singleObsSearch.where = {
					_id: obs._id
				};
				singleObsSearch.include[2].required = false;
				var include = _.map(singleObsSearch.include, function(n) {
					return JSON.stringify(n);
				});
				Observation.query({
					where: {
						_id: obs._id
					},
					include: JSON.stringify(include)
				}, function(result, headers) {
					$scope.displayed.unshift(result[0])
					$scope.displayed.pop();
				})
			});

			$scope.$on('observation_updated', function(ev, obs) {

				ObservationStateService.updated = true;
			});


			$scope.$on('observation_deleted', function(ev, obs) {

				var index = _.indexOf($scope.displayed, _.find($scope.displayed, {
					_id: obs._id
				}));

				$scope.displayed.splice(index, 1);
			});

			

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

				} else if ($stateParams.searchterm === "today") {

					search.where.observationDate = $filter('date')(moment().startOf('day').toDate(), "yyyy-MM-dd", '+0200')
					
				} else if ($stateParams.searchterm === "3days") {

					search.where.observationDate = {
						gt: $filter('date')(moment().startOf('day').subtract(3, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}
				} else if ($stateParams.searchterm === "7days") {

					search.where.observationDate = {
						gt: $filter('date')(moment().startOf('day').subtract(7, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}

				} else if ($stateParams.searchterm === "foreign") {

					search.include[2].required = false;
					search.where.locality_id = {"$eq":null};

				} else if ($stateParams.locality_id && $stateParams.date) {
					search.where.observationDate = {

						gt: $filter('date')(moment($stateParams.date).toDate(), "yyyy-MM-dd", '+0200')
					};
					search.where.locality_id = $stateParams.locality_id;
				} else if ($stateParams.taxon_id) {
					search.include[0].where.Taxon_id = $stateParams.taxon_id;


					search.include[0].where.Determination_validation = ['Godkendt', 'Valideres', 'Afventer', 'Gammelvali'];

				};

			}
			$scope.getCreatedAt = function(createdAt) {
				var lang = "da";
				if ($cookies.get('preferred_language') === "en") {
					lang = "en"
				}
				return moment(createdAt).lang(lang).fromNow();
			}

			$scope.getDate = function(observationDate, observationDateAccuracy) {

				var splitted = observationDate.split("T")[0].split("-");
				if(splitted.length ===3)
				{if (observationDateAccuracy === 'month') {
					//console.log("spl "+parseInt(splitted[1]))
					return moment.months()[parseInt(splitted[1]) - 1] + " " + splitted[0];
				} else if (observationDateAccuracy === 'year') {
					return splitted[0];
				} else if (observationDateAccuracy === 'invalid') {
					return "ingen dato"
				}} else {
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
				var defaultOrder = ($stateParams.searchterm && $stateParams.searchterm === "mine") ? [
					['createdAt', 'DESC'],
					['_id', 'DESC']
				] : [
					['observationDate', 'DESC'],
					['_id', 'DESC']
				];
				var order = (tableState.sort.predicate) ? [
					[tableState.sort.predicate]
				] : defaultOrder;
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

				$scope.updateValidation = function(row, validation) {



					Determination.updateValidation({
							id: row.primarydetermination_id
						}, {
							validation: 'Godkendt'
						}).$promise
						.then(function(determination) {
							row.DeterminationView.Determination_validation = 'Godkendt'

							//var txt = (determination.validation === "Afventer") ? "Bestemmelse afventer" : ("Fundet er "+determination.validation);
							//$scope.showSimpleToast(txt)
						})
						.catch(function(err) {

							ErrorHandlingService.handle500();
						})

				}


				Observation.query(query, function(result, headers) {

					$scope.totalCount = headers('count');

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

						showTooltip(e.trigger, 'Copied!');
					});
					clipboard.on('error', function(e) {

						showTooltip(e.trigger, fallbackMessage(e.action));
					});
				}, function(err) {
					console.log(err, status)

					if (err.status === 504) {
						ErrorHandlingService.handle504();
					}
					if (err.status === 500) {
						ErrorHandlingService.handle500();
					}
				});

			};



		}

	]);
