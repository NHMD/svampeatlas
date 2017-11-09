'use strict';

angular.module('svampeatlasApp')
	.controller('SearchListCtrl', ['$scope', '$rootScope', '$filter', 'Auth', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'Observation', '$mdMedia', '$mdDialog', 'ObservationSearchService',  '$stateParams', '$state', 'ObservationModalService', 'ObservationFormService', 'ErrorHandlingService', 'Determination', '$cookies', 'appConstants', 'StoredSearch', 'SpeciesModalService','$mdToast',
		function($scope, $rootScope, $filter, Auth, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService,  $stateParams, $state, ObservationModalService, ObservationFormService, ErrorHandlingService, Determination, $cookies, appConstants, StoredSearch, SpeciesModalService, $mdToast) {

			$scope.moment = moment;
			$scope.Auth = Auth;
			$scope.currentUser = Auth.getCurrentUser();
			$scope.stItemsPrPage = 100;
			$scope.ObservationModalService = ObservationModalService;
			$scope.$state = $state;
			$scope.ObservationFormService = ObservationFormService;
			$scope.$stateParams = $stateParams;
			
			$scope.baseUrl =appConstants.baseurl;
			$scope.AcceptedDeterminationScore = appConstants.AcceptedDeterminationScore;
			$scope.ProbableDeterminationScore = appConstants.ProbableDeterminationScore;
			$scope.SpeciesModalService = SpeciesModalService;
			
			
			$scope.csvSeparator = ",";
			$scope.setCsvSeparator = function(sep){
				$scope.csvSeparator= sep;
			}
			var csvDeferred = $q.defer();
			$scope.csv = csvDeferred.promise;
			
			$scope.getObservationCsv = function(){
				
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
				
				function getValidationStatus(row){
					
					if(row.DeterminationView.Determination_validation === 'Godkendt' && row.DeterminationView.Determination_validator_id) {
						return $translate.instant('VALIDATION_STATUS_EXPERT')
					} else if (row.DeterminationView.Determination_validation === 'Godkendt' && !row.DeterminationView.Determination_validator_id){
						return $translate.instant('VALIDATION_STATUS_COMMUNITY_LEVEL_3')
					} else if (row.DeterminationView.Determination_validation === 'Afvist'){
						return $translate.instant('Afvist')
					} else if (row.DeterminationView.Determination_score >= $scope.AcceptedDeterminationScore){
						return $translate.instant('VALIDATION_STATUS_COMMUNITY_LEVEL_3')
					} else  {
						return $translate.instant('Afventer')
					}
				}
				
				if(parseInt($scope.totalCount) > 10000){
					$mdToast.show(
						$mdToast.simple()
						.textContent($translate.instant('Der kan kun downloades CSV filer med op til 10000 poster. Prøv at indsnævre din søgning.'))
						.position("top left")
						
						.hideDelay(3000)
					);
				}
				else
				{
					$scope.csvInProgress = true;
				
				
				
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
					
					where: csvsearch.where || {},
					include: JSON.stringify(csvqueryinclude)
				};
				
				if (csvsearch.selectedMonths)   {
					q.selectedMonths = csvsearch.selectedMonths.toString();
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
							validationStatus: getValidationStatus(e),
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
				
				
				
				
				
				
			}

			





			$scope.$on('new_observation', function(ev, obs) {

				if(!$scope.displayed) return;
				
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

				if(!$scope.displayed) return;
					
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



					})
				
			});


			$scope.$on('observation_deleted', function(ev, obs) {
				if(!$scope.displayed) return;
				
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
				var useLichenFilter = Boolean(localStorage.getItem('use_lichen_filter'));
				if ($stateParams.searchterm === "mine") {

					search.include[1].where = {
						_id: Auth.getCurrentUser()._id
					}
					search.include[1].required = true;
					// include foreign
					search.include[2].required = false;

				} else if ($stateParams.searchterm === "today") {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.where.observationDate = $filter('date')(moment().startOf('day').toDate(), "yyyy-MM-dd", '+0200');
					
					// remove this if we don´t want foreign sightings in default searches
					search.include[2].required = false;
					
				} else if ($stateParams.searchterm === "3days") {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.where.observationDate = {
						gt: $filter('date')(moment().startOf('day').subtract(3, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}
					
					// remove this if we don´t want foreign sightings in default searches
					search.include[2].required = false;
					
				} else if ($stateParams.searchterm === "7days") {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.where.observationDate = {
						gt: $filter('date')(moment().startOf('day').subtract(7, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}
					
					// remove this if we don´t want foreign sightings in default searches
					search.include[2].required = false;

				} else if ($stateParams.searchterm === "needsvalidation") {
					
					search.include[0].where = {
						
						$and: [{Determination_validation: { $ne: 'Godkendt'}},{Determination_validation: { $ne: 'Afvist'}} , {Determination_score: {$lt: 80}}]
					};
					
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					};
					
					// remove this if we don´t want foreign sightings in default searches
					search.include[2].required = false;

				} else if ($stateParams.searchterm === "foreign") {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.include[2].required = false;
					search.where.locality_id = {"$eq":null};

				} else if ($stateParams.locality_id && $stateParams.date) {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.where.observationDate = {

						gt: $filter('date')(moment($stateParams.date).toDate(), "yyyy-MM-dd", '+0200')
					};
					search.where.locality_id = $stateParams.locality_id;
				} else if ($stateParams.taxon_id) {
					search.include[0].where.Taxon_id = $stateParams.taxon_id;


					search.include[0].where.Determination_validation = ['Godkendt', 'Valideres', 'Afventer', 'Gammelvali'];

				};

			} ;
			
			var storedSearchDeferred = $q.defer();
			if(ObservationSearchService.storedSearch && !$stateParams.searchterm){
				$state.transitionTo('search-list', {searchid: ObservationSearchService.storedSearch._id}, {
				    location: true,
				    inherit: true,
				    relative: $state.$current,
				    notify: false
				})
				
				$scope.storedSearch = ObservationSearchService.storedSearch;
			}
			if($stateParams.searchid){
				console.log($stateParams.searchid)
				
				StoredSearch.get({id: $stateParams.searchid}).$promise.then(function(ss){
					
					
					ObservationSearchService.reset();
					$scope.search = ObservationSearchService.getSearch();
					var storedSearch  = JSON.parse(ss.search);
					if (!$scope.search.where) {
						$scope.search.where = {};
					}

					ObservationSearchService.convertSearchDateStrings(storedSearch)
					ObservationSearchService.uiSearchToDBquery(storedSearch, $scope.search)
					storedSearchDeferred.resolve();
					$scope.storedSearch = ss;
					ObservationSearchService.storedSearch = ss;
					
				})
				
				
			} else {
				$scope.search = ObservationSearchService.getSearch();
				if (_.isEmpty($scope.search)) {
					$state.go('search')
				};
				
				storedSearchDeferred.resolve();
				
			}
			
			
			$scope.getCreatedAt = function(createdAt) {
				var lang = "da";
				if ($cookies.get('preferred_language') === "en") {
					lang = "en"
				}
				return moment(createdAt).locale(lang).fromNow();
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
			storedSearchDeferred.promise.then(function(){
				$scope.queryinclude = _.map($scope.search.include, function(n) {
					return JSON.stringify(n);
				});
				
			})
			




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
				var defaultOrder = ($stateParams.searchterm && ($stateParams.searchterm === "mine" || $stateParams.searchterm === "needsvalidation")) ? [
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
					validationStatusUpdatedSince: ObservationSearchService.getSearch().validationStatusUpdatedSince,
					where: ObservationSearchService.getSearch().where || {},
					include: JSON.stringify($scope.queryinclude)
				};
				
				if (ObservationSearchService.getSearch().selectedMonths)   {
					query.selectedMonths = ObservationSearchService.getSearch().selectedMonths.toString();
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

storedSearchDeferred.promise.then(function(){
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
	
})
				

			};



		}

	]);
