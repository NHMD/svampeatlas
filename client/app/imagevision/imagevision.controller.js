'use strict';

angular.module('svampeatlasApp')
	.controller('ImageVisionCtrl', function(appConstants, $scope,  $translate, Auth, User, Upload, $http, SpeciesModalService, ObservationFormService, $mdMedia) {
		$scope.$mdMedia = $mdMedia;
		$scope.Auth = Auth;
		
		var that = this;
		this.SpeciesModalService = SpeciesModalService;
		this.Math = Math;
		this.files = [];
		this.loading = false;
		this.translate = $translate;
		this.createObservation = function($event, tile){
			Upload.resize(that.files[0], {width: 1800, height: 1200, quality: .9,  restoreExif: true}).then(function(resizedFile){
				ObservationFormService.show(
					$event, 
					null, 
					false, 
					{	
						taxon: tile.acceptedTaxon, 
						file: resizedFile, 
						score: parseFloat(tile.score * 100).toFixed(2), 
						list: that.results.map(function(r){
								return r.acceptedTaxon.FullName+" ("+parseFloat(r.score * 100).toFixed(2)+")"
				}).join(', ')
			})
				
				
			});

			
		}
		
		this.resetImages = function() {
			
			if(that.files.length > 0){
				that.files.pop();
				delete that.results;
			}
		}
		that.getBackgroundStyle = function(tile){
			
			var uri;
			if(tile.acceptedTaxon.images.length > 0){
				uri = tile.acceptedTaxon.images[0].uri;
			} else if(tile.acceptedTaxon.synonyms.length > 0){
				for(var i =0; i < tile.acceptedTaxon.synonyms.length; i++){
					if(tile.acceptedTaxon.synonyms[i].images.length > 0){
						uri = tile.acceptedTaxon.synonyms[i].images[0].uri;
						break
					}
				}
			}
			var url = appConstants.baseurl+appConstants.thumborUrl+"224x224/"
	
			+ uri;
	  	  
			
		    return {'background-image':  'url('+url+')', 'background-size': 'cover'};
		}

		
		this.$translate = $translate;
		
		$scope.$watch(angular.bind(this, function() {
			return this.files; // `this` IS the `this` above!!
		}), function(newVal, oldVal) {
			
			if (newVal && newVal.length > 0) {
				
					that.analyze()
			}


		});
		
		this.analyze = function(){
			that.loading = true;
		  that.showPoisonousWarning = false;
			
			const reader = new FileReader();
			Upload.resize(that.files[0], {width: 900, height: 600})
				.then(function(resizedFile){
				    reader.readAsDataURL(resizedFile);
				    reader.onload = function(){
				      var encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
				      if ((encoded.length % 4) > 0) {
				        encoded += '='.repeat(4 - (encoded.length % 4));
				      }
					  
					 return $http.post('/api/imagevision', {"instances":[ {"image_in": { "b64": encoded}}]}
					  
						//  
					  
				  ).then(function successCallback(response) {
					  that.results = response.data;
					  
					  for(var i =0; i < that.results.length; i++){
						  if(that.results[i].acceptedTaxon.attributes.spiselighedsrapport && that.results[i].acceptedTaxon.attributes.spiselighedsrapport.indexOf('giftig') > -1){
							  that.showPoisonousWarning = true;
						  }
					  }
					  
					  that.loading = false;
					    }, function errorCallback(response) {
							that.error = response;
							delete that.results
	  					  that.loading = false;
						  that.showPoisonousWarning = false;
							
					    });
					  
				    };
				    reader.onerror = function(error) {reject(error)};
				});
			    
				
			
			
					
			
			
		}
	/*	if (that.files && that.files.length) {
			$scope.fileUploadInProgress = true;
			$scope.statusMsg = (that.files.length > 1) ? 'Sender fotos...' : 'Sender foto...';
			// or send them all together for HTML5 browsers:
			return Upload.upload({
					url: 'api/observations/' + obs._id + '/images',
					arrayKey: '',
					data: {
						file: that.files
					}
				})
				.then(function(resp) {
					$scope.fileUploadInProgress = false;
					console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
				}, function(resp) {
					alert("Billedet blev ikke gemt - luk venligst fundet og prøv igen.")
					console.log('Error status: ' + resp.status);
				}, function(evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					$scope.fileProgress = progressPercentage;
					console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				})
				.then(function() {
					return obs
				});
		} */
		

	})
