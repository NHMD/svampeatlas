'use strict';

angular.module('svampeatlasApp')
	.controller('DkCheckListGalleryCtrl', ['$scope',  'Auth', 'Taxon', '$mdMedia', '$mdDialog',  '$stateParams', '$state',  'ErrorHandlingService',  '$cookies', 'appConstants','preloader','$translate', 'SpeciesModalService', '$filter',
		function($scope, Auth, Taxon, $mdMedia, $mdDialog,  $stateParams, $state,  ErrorHandlingService, $cookies, appConstants, preloader, $translate, SpeciesModalService, $filter ) {

			$scope.moment = moment;
			$scope.translate = $translate;
			$scope.Auth = Auth;
			$scope.currentUser = Auth.getCurrentUser();
			$scope.$state = $state;
			$scope.$stateParams = $stateParams;
			$scope.mdMedia = $mdMedia;
			$scope.baseUrl = appConstants.baseurl;
			
			$scope.displayed = [];
			$scope.SpeciesModalService = SpeciesModalService;
			// Only use table state for correct pagination when a row update has occurred - otherwise delete state 


			
	/*		$scope.getImageUrl = function(tile) {
				var url = appConstants.imageurl + tile.Images[0].name + ".JPG";
				
				
				return preload(url).then(function(url){
					return url;
				})
				
				
				//return appConstants.imageurl + tile.Images[0].name + ".JPG";
			} */
			
		
			$scope.getBackgroundStyle = function(tile){
				
				var missingimg = ($mdMedia('xs')) ? "assets/images/missing-img-1-1.png": "assets/images/missing-img-4-3.png";
				var thumborUrl  = appConstants.baseurl+appConstants.thumborUrl+"300x200/"
				var uri = (tile.Images.length > 0) ? thumborUrl+tile.Images[0].uri : missingimg;
				
			    return {'background-image':  'url('+uri+')', 'background-size': 'cover'};
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

			var storedState = localStorage.getItem('dkchecklist_table_search');
			if(storedState){
			$scope.search =	JSON.parse(storedState) 
			} else {
				$scope.search = {};
				$scope.search.selectedHigherTaxa = [];
				$scope.search.selectedMorphoGroup = [];	
			};
			
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
					"as": "acceptedTaxon"
				} ,
					{
										"model": "TaxonAttributes",
										"as": "attributes",
										"attributes": ['PresentInDK'],
										"where": JSON.stringify({
											PresentInDK: true
										})
									},
					
					 {
					"model": "TaxonDKnames",
					"as": "Vernacularname_DK",
					"required": false
				},{
					"model": "TaxonStatistics",
					"as": "Statistics",
					"required": false
				}, {
					"model": "TaxonImages",
					"as": "Images",
					"required": false
				},]


			};
			
			if($scope.search.redliststatus){
				$scope.query.include[0].where = JSON.stringify({
					year: 2009,
					status: $scope.search.redliststatus
				})
				$scope.query.include[0].required = true
			} else {
				$scope.query.include[0].where = JSON.stringify({
										year: 2009
									});
									$scope.query.include[0].required = false;
			}
			if ($scope.search.selectedHigherTaxa.length === 0 && $scope.search.selectedMorphoGroup.length === 0){
				delete $scope.query.where.$or;
			} else {
				$scope.query.where.$or = []
			}
			
			if ($scope.search.selectedHigherTaxa.length > 0) {
				  _.each($scope.search.selectedHigherTaxa, function(tx) {

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
			
			if ($scope.search.selectedMorphoGroup.length > 0) {
				 _.each($scope.search.selectedMorphoGroup, function(mg) {

					
				$scope.query.where.$or.push({morphogroup_id: mg._id})
					 

				})
			} 
			
			
			if($scope.search.selectedMycokeyCharacters.length > 0){
				for (var i = 0; i < $scope.search.selectedMycokeyCharacters.length; i++) {

					$scope.query.include.push({
						model: "MycokeyCharacterView",
						as: "character" + i,
						required: true,
						where: JSON.stringify({
							CharacterID: $scope.search.selectedMycokeyCharacters[i].CharacterID
						})
					})

				}
			}
			
			if($scope.search.indexLetter && $scope.search.indexLetter !== 'any'){
				
				//$state.go($state.current, {indexLetter: $scope.search.indexLetter})
				$state.transitionTo('checklist-gallery', {indexLetter: $scope.search.indexLetter}, {
				    location: true,
				    inherit: true,
				    relative: $state.$current,
				    notify: false
				})
				//$stateParams.indexLetter = $scope.search.indexLetter;
				$scope.query.where.FullName = {
					like: $scope.search.indexLetter + "%"
				
			}
		} else {
			delete $scope.query.where.FullName;
		}
				
				$scope.isLoading = true;


			

				
				
				$scope.limit = 24;
				$scope.offset = 0;
				
		
				
				$scope.loadTiles = function(limit, offset){
					
					var query = angular.copy($scope.query);
					
					query._order = JSON.stringify([['Path']]);
					query.offset = offset;
					query.limit = limit;
				query.include = JSON.stringify(query.include)
					
					query.acceptedTaxaOnly = true;
					
			
				

					Taxon.query(query, function(result, headers) {

						$scope.totalCount = headers('count');

						
						
						preloader.preloadImages(result).then(
							function(missingImages){
								$scope.isLoading = false;
								$scope.displayed = $scope.displayed.concat(result);
								// returns an array of _id´s of failed images. May ne posted to server to flag missing images
							}
						)
						
						
						$scope.isLoading = false;
						$scope.offset = offset +limit;
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
				
				
				$scope.loadTiles($scope.limit, $scope.offset)
			



		}

	]);
