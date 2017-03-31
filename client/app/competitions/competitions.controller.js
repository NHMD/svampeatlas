'use strict';

angular.module('svampeatlasApp')
  .controller('CompetitionsCtrl',function ($scope,$mdMedia, appConstants,  $translate, Competition, $stateParams) {
   
	  var that = this;
	  this.$mdMedia = $mdMedia;
	  this.info= {
		 speciescount : { description: "Flest fund af rødlistede arter", details: "Konkurrencen går på finder, så alle findere på et fund tildeles point. Der er ingen grund til dobbletindtastinger, som helst frabedes."},
		  numberofobservations:{ description: "Flest fund" , details: "Konkurrencen går på finder, så alle findere på et fund tildeles point. Der er ingen grund til dobbletindtastinger, som helst frabedes."},
		  
		  numberofmobileobservations: { description:"Flest fund indlagt med mobile enheder",  details: "Konkurrencen går på rapportør."},
		  numberofarchiveobservations:{ description: "Flest fund indlagt fra gamle notesbøger mv.", details: "Her tælles fund fra tidligere år, indlagt i konkurrenceåret. Konkurrencen går på rapportør."},

		  pioneer: { description:"Flest fund af arter fra områder (UTM felter), hvor de ikke før var kendt", details: "Konkurrencen går på finder, så alle findere på et fund tildeles point. Der er ingen grund til dobbletindtastinger, som helst frabedes."},
		  highjumper :{ description: "Flest nye arter på den personlige fundliste", details: "Konkurrencen går på finder, så alle findere på et fund tildeles point. Der er ingen grund til dobbletindtastinger, som helst frabedes."}
	  	
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
		  if($stateParams.controller === "speciescount"){
		  	params.redlisted = true
		  }
		  if($stateParams.controller === "speciescount" || $stateParams.controller === "numberofobservations" || $stateParams.controller === "pioneer" || $stateParams.controller === "highjumper"  ){
			  params.persontype  = "finder";
		  }
		  params.cachekey = that.currentController + that.selectedYear;
	   Competition.get(params).$promise
		  .then(function(data){
	   		  that.serverData = data;
			   that.isLoading = false;
	   })
	  } 
   
	  this.updateYear(currentYear);
	

  })
