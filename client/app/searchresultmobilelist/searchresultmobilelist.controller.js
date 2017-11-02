'use strict';

angular.module('svampeatlasApp')
	.controller('SearchMobileListCtrl', ['$scope','$rootScope', '$filter', 'Auth', 'Taxon', 'Datamodel', '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'Observation', '$mdMedia', '$mdDialog', 'ObservationSearchService', 'ObservationStateService', '$stateParams', '$state', 'ObservationModalService', 'ObservationFormService', 'ErrorHandlingService', 'Determination', '$cookies', 'appConstants','preloader','StoredSearch', 'MapBox',  
		function( $scope, $rootScope, $filter, Auth, Taxon, Datamodel, $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService, ObservationStateService, $stateParams, $state, ObservationModalService, ObservationFormService, ErrorHandlingService, Determination, $cookies, appConstants, preloader, StoredSearch, MapBox) {
			
			var vm = this;
			MapBox.getTicket().then(function(ticket){
				vm.mapboxToken = ticket;
			})
			vm.moment = moment;
			vm.translate = $translate;
			vm.Auth = Auth;
			vm.currentUser = Auth.getCurrentUser();
			vm.stItemsPrPage = 100;
			vm.ObservationModalService = ObservationModalService;
			vm.$state = $state;
			vm.ObservationFormService = ObservationFormService;
			vm.$stateParams = $stateParams;
			vm.mdMedia = $mdMedia;
			vm.baseUrl = appConstants.baseurl;
			vm.AcceptedDeterminationScore = appConstants.AcceptedDeterminationScore;
			vm.ProbableDeterminationScore = appConstants.ProbableDeterminationScore;
			
			vm.displayed = [];
			// Only use table state for correct pagination when a row update has occurred - otherwise delete state 

			
		
			vm.getBackgroundStyle = function(tile){
				
				var url = appConstants.baseurl+appConstants.thumborUrl+"150x0/"
		
				+appConstants.baseurl+appConstants.imageurl + tile.Images[0].name + ".JPG";
		  	  
				
			    return {'background-image':  'url('+url+')', 'background-size': 'cover'};
			}


			vm.updateValidation = function(row, validation) {



				Determination.updateValidation({
						id: row.primarydetermination_id
					}, {
						validation: 'Godkendt'
					}).$promise
					.then(function(determination) {
						row.DeterminationView.Determination_validation = 'Godkendt';
						row.DeterminationView.Determination_validator_id = vm.currentUser._id;
						
						
					})
					.catch(function(err) {

						ErrorHandlingService.handle500();
					})

			}
			
			vm.getCreatedAt = function(createdAt) {
				var lang = "da";
				if ($cookies.get('preferred_language') === "en") {
					lang = "en"
				}
				return moment(createdAt).locale(lang).fromNow();
			}

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
					search.where.observationDate = $filter('date')(moment().startOf('day').toDate(), "yyyy-MM-dd", '+0200')
					
				} else if ($stateParams.searchterm === "3days") {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.where.observationDate = {
						gt: $filter('date')(moment().startOf('day').subtract(3, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}
				} else if ($stateParams.searchterm === "7days") {
					if(useLichenFilter) {
						search.include[0].where.lichenized = 1;
					}
					search.where.observationDate = {
						gt: $filter('date')(moment().startOf('day').subtract(7, 'days').toDate(), "yyyy-MM-dd", '+0200')
					}

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

			}
			
			if(ObservationSearchService.storedSearch && !$stateParams.searchterm){
				$state.transitionTo('search-gallery', {searchid: ObservationSearchService.storedSearch._id}, {
				    location: true,
				    inherit: true,
				    relative: $state.$current,
				    notify: false
				})
				vm.storedSearch = ObservationSearchService.storedSearch;
			}
			var storedSearchDeferred = $q.defer();
			if($stateParams.searchid){
				console.log($stateParams.searchid)
				
				StoredSearch.get({id: $stateParams.searchid}).$promise.then(function(ss){
					
					
					ObservationSearchService.reset();
					var search = ObservationSearchService.getSearch();
					var storedSearch  = JSON.parse(ss.search);
					if (!search.where) {
						search.where = {};
					}

					ObservationSearchService.convertSearchDateStrings(storedSearch)
					ObservationSearchService.uiSearchToDBquery(storedSearch,search)
					
					storedSearchDeferred.resolve();
					vm.storedSearch = ss;
					ObservationSearchService.storedSearch = ss;
					
				})
				
				
			} else {
				vm.search = ObservationSearchService.getSearch();

				if (_.isEmpty(vm.search)) {
					$state.go('search')
				};
				
				storedSearchDeferred.resolve();
				
			}

			vm.getDate = function(observationDate, observationDateAccuracy) {

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

			
			
				
				vm.isLoading = true;


				var order = ($stateParams.searchterm && $stateParams.searchterm === "mine") ? [
					['createdAt', 'DESC'],
					['_id', 'DESC']
				] : [
					['observationDate', 'DESC'],
					['_id', 'DESC']
				];


				
				
				vm.limit = 24;
				vm.offset = 0;
				
		
				
				vm.loadTiles = function(limit, offset){
					
					vm.isLoading =true;
					var query = {
						//order: order || 'observationDate DESC',
						_order: JSON.stringify(order),
						offset: offset,
						limit: limit,
						activeThreadsOnly: vm.search.activeThreadsOnly,
						recentlyCommented: vm.search.recentlyCommented,
						
						where: vm.search.where || {},
						include: JSON.stringify(vm.queryinclude)
					};
					
					if (vm.search.selectedMonths)   {
						query.selectedMonths = vm.search.selectedMonths.toString();
					};
					
					var geometry = vm.search.geometry;
					if (geometry) {
						query.geometry = geometry;
					}
				

					Observation.query(query, function(result, headers) {

						vm.totalCount = headers('count');

						
						
						/*preloader.preloadImages(result).then(
							function(missingImages){
								vm.isLoading = false;
								vm.displayed = vm.displayed.concat(result);
								// returns an array of _id´s of failed images. May ne posted to server to flag missing images
							}
						) */
						
						vm.displayed = vm.displayed.concat(result);
						
						
						vm.isLoading = false;
						vm.offset = offset +limit;
					}, function(err) {
						console.log(err, status)

						if (err.status === 504) {
							ErrorHandlingService.handle504();
						}
						if (err.status === 500) {
							ErrorHandlingService.handle500();
						}
					});
				}
				
				storedSearchDeferred.promise.then(function(){
					vm.search = angular.copy(ObservationSearchService.getSearch());
					//vm.search.include[5].required = true;

					vm.queryinclude = _.map(vm.search.include, function(n) {
						return JSON.stringify(n);
					});
					vm.loadTiles(vm.limit, vm.offset);
					
				})

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
						vm.displayed.unshift(result[0])
						vm.displayed.pop();
					})
				});

				$scope.$on('observation_updated', function(ev, obs) {

				
					
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

							var index = _.indexOf($scope.displayed, _.find(vm.displayed, {
								_id: obs._id
							}));



							vm.displayed[index] = result[0];
							vm.displayed[index].isSelected = true;



						})
				
				});


				$scope.$on('observation_deleted', function(ev, obs) {

					var index = _.indexOf(vm.displayed, _.find(vm.displayed, {
						_id: obs._id
					}));

					vm.displayed.splice(index, 1);
				});



		}

	]);
