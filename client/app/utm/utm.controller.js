'use strict';

angular.module('svampeatlasApp')
  .controller('UtmCtrl',function ($scope,$mdMedia, appConstants, SearchService, leafletData) {
   
	  $scope.appConstants = appConstants;
	  $scope.$mdMedia = $mdMedia;
	  
	$scope.mapsettings = {
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
			
			if(oldVal){
				oldVal.setStyle({color: '#0000FF', fillColor: '#0000FF', weight: 2});
			}
			
			newVal.setStyle({color: '#FF0000', fillColor: '#FF0000', weight: 5});
			
		}
		
	})
	
	SearchService.getUTM10().then(function(polygons){
		leafletData.getMap().then(function(map){
		$scope.utm10polygons = {};
		var onPolyClick = function(event){
	
			$scope.selectedUTM10 = event.target;
			
			

		};
		
		

		
				for(var i=0; i < polygons.length; i++){
					var poly = new L.geoJson(polygons[i].geom, {'isSelected': false, 'label': polygons[i].name, '_id': polygons[i]._id, weight: 2});
					
					$scope.utm10polygons[polygons[i].name] = poly;
					map.addLayer(poly)
				
				
					poly.on('click', onPolyClick);
				}
		})
	})

  })
