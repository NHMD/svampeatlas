'use strict';

angular.module('svampeatlasApp')
  .controller('ProfileCtrl', function($scope,$filter, User, Auth, $window, $http, $mdMedia, $mdDialog, $mdToast, $translate, ObservationSearchService, Observation, ErrorHandlingService, $stateParams, $state, HigherTaxonomyModalService, ObservationModalService, appConstants) {
	  $scope.HigherTaxonomyModalService = HigherTaxonomyModalService;
	  $scope.ObservationModalService = ObservationModalService;
	$scope.$mdMedia = $mdMedia;
	$scope.currentUser = Auth.getCurrentUser();
	$scope.isLoggedIn = Auth.isLoggedIn;
	$scope.baseUrl = appConstants.baseurl;
	$scope.$state = $state;
	$scope.dashBoardUser = ($stateParams.userid) ? User.get({id:$stateParams.userid}) : User.get();
	$scope.dashBoardUser.$promise.then(function(usr){
		$scope.dashboardUserID = usr._id;
		initialize()
	});
	
	



	
	$scope.activitySince = 3;
	$scope.validationUpdatedSince = 3;
	$scope.$watch('activitySince', function(newval, oldval){
		
		if(newval && newval !== oldval){
			getRecentActivity($scope.dashboardUserID )
		}
	})
	
	$scope.$watch('validationUpdatedSince', function(newval, oldval){
		
		if(newval && newval !== oldval){
			validationRecentlyUpdated($scope.dashboardUserID )
		}
	})
	
	
	
	function getRecentActivity(userid){
		var search = ObservationSearchService.getNewSearch();
		search.wasInitiatedOutsideSearchForm = true;
		search.where = {primaryuser_id : userid};
		var d = moment().subtract($scope.activitySince, 'days').toDate()
		
		search.include[2].required = false;
		search.include[6].required = true;
		search.recentlyCommented = $filter('date')(d, "yyyy-MM-dd", '+0200')
		var queryinclude = _.map(search.include, function(n) {
			return JSON.stringify(n);
		});
		
		var query = {
			
			where: search.where || {},
			include: JSON.stringify(queryinclude),
			recentlyCommented: search.recentlyCommented
		};
		
		$scope.recentActivitySearch = search;
		Observation.query(query, function(result, headers) {
			$scope.activytyCount = result.length;
			
		})
		//$state.go('search-list')
		
	}
	
	function validationRecentlyUpdated(userid){
		var search = ObservationSearchService.getNewSearch();
		search.wasInitiatedOutsideSearchForm = true;
		search.where = {primaryuser_id : userid};
		var d = moment().subtract($scope.validationUpdatedSince, 'days').toDate()
		
		search.include[2].required = false;
		//search.include[6].required = true;
		search.validationStatusUpdatedSince = $filter('date')(d, "yyyy-MM-dd", '+0200')
		var queryinclude = _.map(search.include, function(n) {
			return JSON.stringify(n);
		});
		
		var query = {
			
			where: search.where || {},
			include: JSON.stringify(queryinclude),
			validationStatusUpdatedSince: search.validationStatusUpdatedSince
		};
		
		$scope.validationStatusUpdatedSinceSearch = search;
		Observation.query(query, function(result, headers) {
			$scope.validationStatusUpdatedSinceCount = result.length;
			
		})
		//$state.go('search-list')
		
	}
	
	
	
	var thisYear = new Date().getFullYear();
	
	$scope.years = [];
	for(var i = thisYear; i > (thisYear - 10); i--){
		$scope.years.push(i);
	}
	$scope.selectedYearForFirstFindings = thisYear;

	
	
	$scope.$watch('selectedYearForFirstFindings', function(newval, oldval){
		if(newval !== oldval){
			delete $scope.firstFindings;
			$scope.loadingFirstFindingsCompleted = false;
			getFirstFindings(newval) ;
		}
	})
	
	$scope.$watch('taxonomicOverviewRankID', function(newval, oldval){
		if(newval && newval !== oldval){
			delete $scope.taxonomicOverview;
			$scope.loadingtaxonomicOverviewCompleted = false;
			getTaxonomicOverView(newval) ;
			setRankName(newval)
		}
	})
	
	function setRankName(RankID){
		$scope.selectedRankName = _.find($scope.higherTaxa, function(e){
			return e.RankID === RankID;
		}).RankName
	}
	
	function initialize(){
	getFirstFindings(thisYear);
	getRecentActivity($scope.dashboardUserID );
	validationRecentlyUpdated($scope.dashboardUserID );
	
	User.getSpeciesCount({id: $scope.dashboardUserID, group: 'countryName, year'})
	.$promise.then(function(res){
		var grouped= {};
		
		_.each(res, function(e){
			if(grouped[e.year]){
				grouped[e.year].countries.push(e)
				grouped[e.year].year = parseInt(e.year)
			} else {
				grouped[e.year] = {countries : [e]}
				grouped[e.year].year = parseInt(e.year)
			}
		});
		$scope.speciesCountGrouped = _.values(grouped);
		$scope.loadingSpeciesCountCompleted = true;
	});
	
	$scope.higherTaxa = [{RankID: 500, RankName: 'Phylum'},{RankID: 1500, RankName: 'Class'},{RankID: 3000,RankName: 'Order'}, {RankID: 4000,RankName: 'Family'}, {RankID: 5000, RankName: 'Genus'}];
	
	$scope.forumPostCount = User.getForumCount({id: $scope.dashboardUserID});
	$scope.imageCount = User.getImageCount({id: $scope.dashboardUserID});
	$scope.countryCount = User.getCountryCount({id: $scope.dashboardUserID});
	$scope.taxonomicOverviewRankID = 4000;
	setRankName($scope.taxonomicOverviewRankID )
	getTaxonomicOverView($scope.taxonomicOverviewRankID)

	$scope.speciesCount = User.getSpeciesCount({id: $scope.dashboardUserID});
	$scope.observationCountGrouped = User.getObservationCount({id: $scope.dashboardUserID});
	
	$scope.observationCountGrouped.$promise.then(function(observations){
		$scope.observationCount = _.reduce(observations, function(prev, obs){
			return prev + obs.count;
		}, 0);
		
	})}
	
	function getTaxonomicOverView(RankID) {
		User.getTaxonomicOverview({id: $scope.dashboardUserID, rankid: $scope.taxonomicOverviewRankID})
		.$promise.then(function(data){
			$scope.taxonomicOverview = data;
			$scope.loadingtaxonomicOverviewCompleted = true;
		})
	}
	
	function getFirstFindings(year) {
		 User.getFirstFindings({id: $scope.dashboardUserID, year: year})
		.$promise.then(function(data){
			$scope.firstFindings = data;
			$scope.loadingFirstFindingsCompleted = true;
		})
	}
   

	$scope.gotoSearchResult = function(searchType, searchProfile) {
		ObservationSearchService.reset();
		var search = ObservationSearchService.getSearch()
		search.wasInitiatedOutsideSearchForm = true;
		if(searchType === 'primaryuser_id'){
			search.include[1].where = {
				_id: $scope.dashboardUserID
			} 
			search.include[1].required = true;
			$state.go('search-list')
		} else if(searchType === 'specieslist'){
			search.include[0].where = {
				$or: {
					Determination_validation: "Godkendt",
					Determination_score: {$gte: appConstants.AcceptedDeterminationScore}
				},
				
				Taxon_RankID : { $gt: 9950}
			} 
			search.include[4].where = {
				user_id: $scope.dashboardUserID
			} 
			search.include[4].required = true;
			$state.go('search-specieslist')
		} else if(searchType === 'forum'){
			 
			search.include[6].where = {
				user_id: $scope.dashboardUserID
			} 
			search.include[6].required = true;
			$state.go('search-list')
		} else if(searchType === 'photos'){
			 
			search.include[5].where = {
				user_id: $scope.dashboardUserID
			} 
			search.include[5].required = true;
			$state.go('search-gallery')
		} else if(searchType === 'specieslistyear'){
			search.where = {observationDate: {$between: [searchProfile.year+'-01-01', searchProfile.year+'-12-31']}}
			search.include[0].where = {
				$or: {
					Determination_validation: "Godkendt",
					Determination_score: {$gte: appConstants.AcceptedDeterminationScore}
				},
				Taxon_RankID : { $gt: 9950}
			} 
			search.include[4].where = {
				user_id: $scope.dashboardUserID
			} 
			search.include[4].required = true;
			// include global obs
			if(!searchProfile.country){
				search.include[2].required = false;
			}
			else if(searchProfile.country === 'Denmark'){ 
				search.include[2].required = true;
			} else if(searchProfile.country !== undefined && searchProfile.country !== 'Denmark'){
				search.include[2].required = false;
				search.include[3].required = true;
				search.include[3].where = {countryName:searchProfile.country}
			}
			
			$state.go('search-specieslist')
		} else if(searchType === 'specieslisthighertaxon'){
			
			search.include[0].where = {
				$or: {
					Determination_validation: "Godkendt",
					Determination_score: {$gte: appConstants.AcceptedDeterminationScore}
				},
				Taxon_RankID : { $gt: 9950},
				Taxon_Path: {like: searchProfile+"%"}
			} 
			search.include[4].where = {
				user_id: $scope.dashboardUserID
			} 
			search.include[4].required = true;
			// include global obs
			search.include[1].required = true;
			$state.go('search-specieslist')
		} else if(searchType === 'recentactivity'){
			ObservationSearchService.reset();
			ObservationSearchService.search = $scope.recentActivitySearch;
			$state.go('search-list')
		} else if(searchType === 'validationStatusUpdatedSince'){
			ObservationSearchService.reset();
			ObservationSearchService.search = $scope.validationStatusUpdatedSinceSearch;
			$state.go('search-list')
		}
		
		
		
		
		
		
		
		
	}
    
	
	
});	
	/******************************/
	
