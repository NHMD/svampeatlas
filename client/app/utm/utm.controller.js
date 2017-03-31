'use strict';

angular.module('svampeatlasApp')
  .controller('UtmCtrl',function ($scope,$mdMedia, appConstants, SearchService, leafletData, $translate, Observation, ObservationSearchService, $mdUtil, $mdSidenav) {
   
	  this.appConstants = appConstants;
	  this.$mdMedia = $mdMedia;
	  var that = this;
	
	  this.maxValues = {
		  max_num_users : 0, 
		  max_num_obs : 0, 
		  max_num_days : 0, 
		  max_num_years : 0, 
		  max_num_species : 0
	  };
	 
	  that.gridColors= ['#FFFDE7', '#FFF9C4', '#FFF59D',  '#FFEE58','#FFC107', '#FFB300', '#FF8F00', '#E65100', '#BF360C', '#D50000'];
	  
	  this.paintGridBy = function(statType, maxVals){
		  
		  $scope.selectedUTM10 = undefined;
		  var max = maxVals["max_"+statType];
		  
		  for(var i = 0; i < that.utm10polygons.length; i++){
			  
			  var colorIndex = Math.ceil((Math.log10(that.utm10polygons[i].options[statType]) / Math.log10(max) ) * 10) -1 ;
			  var color = that.gridColors[colorIndex];
			  
			  var fillOpacity = (colorIndex >=0) ? 0.8 : 0.1;
			that.utm10polygons[i].setStyle({color: color, fillColor: color, weight: 2, fillOpacity: fillOpacity});
		  }
		  
		leafletData.getMap('utmmap').then(function(map){
			map.invalidateSize()
		})
	  }
	  
	  this.showSpeciesListForArea = function(area_id){
		  
		var search =  ObservationSearchService.getNewSearch();
		search.include[7].where.area_id = area_id;
		search.include[7].required = true;
		
		search.include[0].where = {
									
							$or: [{Determination_score: {$gte: appConstants.AcceptedDeterminationScore}, Determination_validation: 'Valideres'},
									{Determination_validation: "Godkendt"}]
						
					}
		var queryinclude = _.map(search.include, function(n) {
				return JSON.stringify(n);
			});
		var query = {

			where: search.where || {},
			include: JSON.stringify(queryinclude)
		};
		
		that.isLoading = true;
		
	  	Observation.getSpeciesList(query, function(result, headers) {

	  		//$scope.taxonCount = headers('count');
	  		that.totalItemCount = parseInt(headers('count'));
	  		that.serverData = result;
	  		that.isLoading = false;
			leafletData.getMap('utmmap').then(function(map){
				map.invalidateSize()
			})
	  	});
	  }
	  
	this.mapsettings = {
		center: {
			lat: 56,
			lng: 11,
			zoom: 6
		},


		layers: {
			baselayers: {
				osm: {
					name: 'OpenStreetMap',
					url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					type: 'xyz'
				}
			}
		}
	};
	
	$scope.$watch('selectedUTM10', function(newVal, oldVal){
		
		if(newVal && newVal !== oldVal){
			
			that.oldStyle = { 
				color: newVal.options.color,
				fillColor: newVal.options.fillColor,
				weight: newVal.options.weight
			};
			
			if(oldVal){
				oldVal.setStyle(that.oldStyle);
			}
			
			newVal.setStyle({color: '#0000FF', fillColor: '#0000FF', weight: 5});
			
		}
		
	})
	
	SearchService.getUTM10().then(function(polygons){
		leafletData.getMap('utmmap').then(function(map){
		that.utm10polygonsMap = {};
		that.utm10polygons = [];
		var onPolyClick = function(event){
	
			$scope.selectedUTM10 = event.target;
			that.showSpeciesListForArea(event.target.options._id)
			

		};

				for(var i=0; i < polygons.length; i++){
					var opts = { 
						label: polygons[i].name, 
						_id: polygons[i]._id, 
						color: '#4CAF50', fillColor: '#4CAF50', weight: 2
					};
						
						opts.num_users = (polygons[i].Statistics) ? polygons[i].Statistics.num_users : 0;
						opts.num_obs = (polygons[i].Statistics) ? polygons[i].Statistics.num_obs : 0; 
						opts.num_days = (polygons[i].Statistics) ? polygons[i].Statistics.num_days : 0;
						opts.num_species = (polygons[i].Statistics) ? polygons[i].Statistics.num_species : 0;
						opts.num_years = (polygons[i].Statistics) ? polygons[i].Statistics.num_years : 0;
					
						
					var poly = new L.geoJson(polygons[i].geom, opts);
					
					that.utm10polygonsMap[polygons[i].name] = poly;
					that.utm10polygons.push(poly);
					map.addLayer(poly)
				
				
					poly.on('click', onPolyClick);
					
					if(polygons[i].Statistics && polygons[i].Statistics.num_users > that.maxValues.max_num_users){
						that.maxValues.max_num_users = polygons[i].Statistics.num_users
					}
					
					if(polygons[i].Statistics && polygons[i].Statistics.num_obs > that.maxValues.max_num_obs){
						that.maxValues.max_num_obs = polygons[i].Statistics.num_obs
					}
					
					if(polygons[i].Statistics && polygons[i].Statistics.num_days > that.maxValues.max_num_days){
						that.maxValues.max_num_days = polygons[i].Statistics.num_days
					}
					
					if(polygons[i].Statistics && polygons[i].Statistics.num_years > that.maxValues.max_num_years){
						that.maxValues.max_num_years = polygons[i].Statistics.num_years
					}
					
					if(polygons[i].Statistics && polygons[i].Statistics.num_species > that.maxValues.max_num_species){
						that.maxValues.max_num_species = polygons[i].Statistics.num_species
					}
					
					
					
				}
				
				map.invalidateSize();
		})
	});
	
	function buildToggler(navID) {
		var debounceFn = $mdUtil.debounce(function() {
			$mdSidenav(navID)
				.toggle()
				.then(function() {
					leafletData.getMap('utmmap').then(function(map) {
						map.invalidateSize()
					})
				})

		}, 200);
		return debounceFn;
	}
	
	$scope.toggleSpeciesListSideNav = buildToggler('utmlistsidenav');
	

  })
