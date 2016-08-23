'use strict';

angular.module('svampeatlasApp')
  .controller('ProfileCtrl', function($scope, User, Auth, $window, $http, $mdMedia, $mdDialog, $mdToast, $translate, ObservationSearchService, Observation, ErrorHandlingService) {
    $scope.errors = {};
	
	$scope.getCurrentUser = Auth.getCurrentUser;
	$scope.isLoggedIn = Auth.isLoggedIn;
	
	var thisYear = new Date().getFullYear();
	
	$scope.years = [];
	for(var i = thisYear; i > (thisYear - 10); i--){
		$scope.years.push(i);
	}
	$scope.selectedYearForFirstFindings = thisYear;

	getFirstFindings(thisYear) ;
	
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
	
	User.getSpeciesCount({id: Auth.getCurrentUser()._id, group: 'countryName, year'})
	.$promise.then(function(res){
		var grouped= {};
		
		_.each(res, function(e){
			if(grouped[e.year]){
				grouped[e.year].countries.push(e)
			} else {
				grouped[e.year] = {countries : [e]}
			}
		});
		$scope.speciesCountGrouped = _.values(grouped);
		var test;
	});
	
	$scope.higherTaxa = [{RankID: 500, RankName: 'Phylum'},{RankID: 1500, RankName: 'Class'},{RankID: 3000,RankName: 'Order'}, {RankID: 4000,RankName: 'Family'}, {RankID: 5000, RankName: 'Genus'}];
	
	$scope.forumPostCount = User.getForumCount({id: Auth.getCurrentUser()._id});
	$scope.imageCount = User.getImageCount({id: Auth.getCurrentUser()._id});
	$scope.countryCount = User.getCountryCount({id: Auth.getCurrentUser()._id});
	$scope.taxonomicOverviewRankID = 4000;
	setRankName($scope.taxonomicOverviewRankID )
	getTaxonomicOverView($scope.taxonomicOverviewRankID)
	//$scope.taxonomicOverview = User.getTaxonomicOverview({id: Auth.getCurrentUser()._id, rankid: $scope.taxonomicOverviewRankID});
	$scope.speciesCount = User.getSpeciesCount({id: Auth.getCurrentUser()._id});
	$scope.observationCountGrouped = User.getObservationCount({id: Auth.getCurrentUser()._id});
	
	$scope.observationCountGrouped.$promise.then(function(observations){
		$scope.observationCount = _.reduce(observations, function(prev, obs){
			return prev + obs.count;
		}, 0);
		
	})
	
	function getTaxonomicOverView(RankID) {
		User.getTaxonomicOverview({id: Auth.getCurrentUser()._id, rankid: $scope.taxonomicOverviewRankID})
		.$promise.then(function(data){
			$scope.taxonomicOverview = data;
			$scope.loadingtaxonomicOverviewCompleted = true;
		})
	}
	
	function getFirstFindings(year) {
		 User.getFirstFindings({id: Auth.getCurrentUser()._id, year: year})
		.$promise.then(function(data){
			$scope.firstFindings = data;
			$scope.loadingFirstFindingsCompleted = true;
		})
	}
   
   /*
	$scope.myObservationsSearch = angular.extend(ObservationSearchService.getNewSearch(), {where: {primaryuser_id: Auth.getCurrentUser()._id}});
	$scope.myObservationsSearch.include[1].required = true;
	$scope.myObservationsSearch.include[1].where = {_id: Auth.getCurrentUser()._id} ;
	$scope.myObservationsSearch.limit = 1;
	
	$scope.mySpeciesListSearch = ObservationSearchService.getNewSearch();
	$scope.mySpeciesListSearch.include[4].where = { user_id: Auth.getCurrentUser()._id};
	$scope.mySpeciesListSearch.include[4].required = true;
	$scope.mySpeciesListSearch.include[0].where = { Determination_validation: "Godkendt"};
	
	
	
	Observation.query({
		include: JSON.stringify( _.map(_.filter($scope.myObservationsSearch.include, function(e){ return e.model !== 'GeoNames'}), function(n) {
		return JSON.stringify(n);
	});),
		where: {},
		limit 1
		
	}, function(result, headers) {

		$scope.myObservationCount = parseInt(headers('count'));


	}, function(err){
		console.log(err, status)
		
		if(err.status === 504) {
			ErrorHandlingService.handle504();
		}
		if(err.status === 500) {
			ErrorHandlingService.handle500();
		}
	});
	
	$scope.queryinclude = _.map(_.filter($scope.mySpeciesListSearch.include, function(e){ return e.model !== 'GeoNames'}), function(n) {
		return JSON.stringify(n);
	});
	Observation.getSpeciesList({
		include: JSON.stringify($scope.queryinclude),
		where: {}
		
	}, function(result, headers) {

		$scope.mySpeciesList = result;


	}, function(err){
		console.log(err, status)
		
		if(err.status === 504) {
			ErrorHandlingService.handle504();
		}
		if(err.status === 500) {
			ErrorHandlingService.handle500();
		}
	});
	
	*/
    
	
	
});	
	/******************************/
	
