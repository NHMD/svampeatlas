'use strict';

angular.module('svampeatlasApp')
	.controller('NotificationListCtrl', ['$scope','$rootScope', '$filter', 'Auth', 'Taxon',  '$timeout', '$q', 'TaxonTypeaheadService', '$translate', 'TaxonomyTags', 'TaxonRedListData', 'Observation', '$mdMedia', '$mdDialog', 'ObservationSearchService', 'ObservationStateService', '$stateParams', '$state', 'ObservationModalService', 'ObservationFormService', 'ErrorHandlingService', 'Determination', '$cookies', 'appConstants','StoredSearch', 'MapBox', 'User','SpeciesModalService', '$mdToast', 
		function( $scope, $rootScope, $filter, Auth, Taxon,  $timeout, $q, TaxonTypeaheadService, $translate, TaxonomyTags, TaxonRedListData, Observation, $mdMedia, $mdDialog, ObservationSearchService, ObservationStateService, $stateParams, $state, ObservationModalService, ObservationFormService, ErrorHandlingService, Determination, $cookies, appConstants, StoredSearch, MapBox, User, SpeciesModalService, $mdToast) {
			
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
			vm.SpeciesModalService = SpeciesModalService;
			vm.offset = 0;
			vm.limit = 25;
			vm.lang = "da";
				if ($cookies.get('preferred_language') === "en") {
					vm.lang = "en"
				};
			vm.isLoading = true;
			 User.getFeed({limit: vm.limit, offset: vm.offset}).$promise.then(function(res){
				 vm.displayed = res.results;
				 vm.endOfRecords = res.endOfRecords;
				 vm.isLoading = false;
			});
		
			vm.getBackgroundStyle = function(tile){
				
				var url = appConstants.baseurl+appConstants.thumborUrl+"112x112/"
		
				+appConstants.baseurl+appConstants.imageurl + tile.img + ".JPG";
		  	  
				
			    return {'background-image':  'url('+url+')', 'background-size': 'cover'};
			}
			
			vm.loadTiles = function(limit, offset){
				vm.isLoading = true;
   			 User.getFeed({limit: vm.limit, offset: vm.offset}).$promise.then(function(res){
   				 vm.displayed = vm.displayed.concat(res.results);
   				 vm.endOfRecords = res.endOfRecords;
 				vm.isLoading = false;
 				vm.offset = offset +limit;
   			});
		
			}

			vm.gotoObservation = function($event, tile){
				
				ObservationModalService.show($event, {_id: tile.observation_id})
				$timeout(function(){
					User.markFeedAsRead({ observationid : tile.observation_id}, {}).$promise.then(function(res){
						for(var i=0; i< vm.displayed.length; i++){
							if(vm.displayed[i].observation_id === tile.observation_id){
								vm.displayed[i].lastRead = res.updatedAt;
							}
						}
						
						$rootScope.$broadcast('notification_status_changed');
					})
				}, 1500)
			}

			vm.stopNotifications = function(tile){
				
				User.stopNotifications({ observationid : tile.observation_id}).$promise.then(function(){
					
	   			 User.getFeed({limit: vm.limit+vm.offset, offset: 0}).$promise.then(function(res){
	   				 vm.displayed = res.results;
	   				 vm.endOfRecords = res.endOfRecords;
	   			});
		
						
					$rootScope.$broadcast('notification_status_changed');
					$mdToast.show(
						$mdToast.simple()
						.textContent($translate.instant('Notifikationer er slået fra for')+" DMS-"+tile.observation_id)
						.position("bottom right")
						
						.hideDelay(3000)
					);
				})
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

			
			



		}

	]);
