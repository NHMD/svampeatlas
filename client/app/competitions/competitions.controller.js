'use strict';

angular.module('svampeatlasApp')
  .controller('CompetitionsCtrl',function ($scope,$mdMedia, appConstants,  $translate, Competition, $stateParams, ObservationSearchService, $state) {
   
	  var that = this;
	  this.$mdMedia = $mdMedia;
	  this.info= {
		 speciescount : { description: "Flest arter", details: "Konkurrencen går på finder, så alle findere på et fund tildeles point. Der er ingen grund til dobbeltindtastinger, som helst frabedes."},
		  numberofobservations:{ description: "Flest fund" , details: "Konkurrencen går på finder, så alle findere på et fund tildeles point. Der er ingen grund til dobbeltindtastinger, som helst frabedes."},
		  
		  numberofmobileobservations: { description:"Flest fund indlagt med mobile enheder",  details: "Konkurrencen går på rapportør."},
		  numberofarchiveobservations:{ description: "Flest fund indlagt fra gamle notesbøger mv.", details: "Her tælles fund fra tidligere år, indlagt i konkurrenceåret. Konkurrencen går på rapportør."},
		  pioneerredlisted: { description:"Flest fund af rødlistede arter fra områder (UTM felter), hvor de ikke før var kendt", details: "Konkurrencen går på finder, så alle findere på et fund tildeles point. Der er ingen grund til dobbeltindtastinger, som helst frabedes."},
		  pioneer: { description:"Flest fund af arter fra områder (UTM felter), hvor de ikke før var kendt", details: "Konkurrencen går på finder, så alle findere på et fund tildeles point. Der er ingen grund til dobbeltindtastinger, som helst frabedes."},
		  highjumper :{ description: "Flest nye arter på den personlige fundliste", details: "Konkurrencen går på finder, så alle findere på et fund tildeles point. Der er ingen grund til dobbeltindtastinger, som helst frabedes."}
	  	
	  };
	  
	  this.currentController = $stateParams.controller;
   //'numberofobservations'
	  var currentYear = parseInt(new Date().getFullYear());
	  this.selectedYear = currentYear;
	  var fromYear = currentYear - 100;
	  this.years = [];
	  for(var i = currentYear; i >= fromYear; i--){
		  that.years.push(i);
	  }
	 
	  this.updateYear = function(year){
		  that.isLoading = true;
		  delete that.serverData;
		  var params = {year : year, controller: $stateParams.controller};
		  
		  if($stateParams.controller === "speciescount" || $stateParams.controller === "numberofobservations" || $stateParams.controller === "pioneer" || $stateParams.controller === "highjumper"  || $stateParams.controller === "pioneerredlisted"){
			  params.persontype  = "finder";
		  }
		  params.cachekey = (that.selectedYear) ? (that.currentController + that.selectedYear) : that.currentController;
	   Competition.get(params).$promise
		  .then(function(data){
	   		  that.serverData = data;
			   that.isLoading = false;
	   })
	  } 
   
	  this.updateYear(currentYear);
	
  	this.gotoSearchResult = function(controller, user_id, year) {
  		ObservationSearchService.reset();
  		var search = ObservationSearchService.getSearch()
  		search.wasInitiatedOutsideSearchForm = true;
  		
		
		if(controller === 'numberofobservations'){
			if(year){
				search.where = {observationDate: {$between: [year+'-01-01', year+'-12-31']}}
			}
  			
  			search.include[4].where = {
  				user_id: user_id
  			} 
  			search.include[4].required = true;
			search.include[2].required = false;
  			
  			$state.go('search-list')
  		} else if(controller === 'speciescount'){
			if(year){
				search.where = {observationDate: {$between: [year+'-01-01', year+'-12-31']}}
			}
  			search.include[0].where = {
  				$or: {
  					Determination_validation: "Godkendt",
  					Determination_score: {$gte: appConstants.AcceptedDeterminationScore}
  				},
				
  				Taxon_RankID : { $gt: 9950}
  			} 
  			search.include[4].where = {
  				user_id: user_id
  			} 
  			search.include[4].required = true;
  			$state.go('search-specieslist')
  		} else if(controller === 'numberofmobileobservations'){
			search.where = {
				primaryuser_id : user_id, 
				os: ["IOS", "Android"]
			};
			if(year){
				search.where.observationDate = {$between: [year+'-01-01', year+'-12-31']}
			}
  			
  			
			search.include[2].required = false;
  			
  			$state.go('search-list')
  		} else if(controller === 'numberofarchiveobservations'){
			search.where = {
				primaryuser_id : user_id, 
				observationDate: {$lt: year+'-01-01'},
				createdAt: {$between: [year+'-01-01', year+'-12-31']}
			};
			
			search.include[2].required = false;
  			
  			$state.go('search-list')
  		} else {
  			
			var params = {controller: controller, year: year, userid: user_id, persontype: 'finder'};
			that.isLoading = true;
			Competition.getObservationIdsForUser(params).$promise
			.then(function(data){
				var obsIds = _.map(data, function(e){
					return e._id;
				})
				
				search.where = {
					_id : obsIds
				};
			
				search.include[2].required = false;
				
				that.isLoading = false;
				
  				if(controller === 'highjumper'){
  			$state.go('search-specieslist')
  					
  				} else {
	  			$state.go('search-list')
  					
  				}
				
			})
  		}
	
  	}

  })
