'use strict';

angular.module('svampeatlasApp')
	.factory(
			"preloader",
			function( $q, $rootScope, appConstants ) {

				// I manage the preloading of image objects. Accepts an array of image URLs.
				function Preloader( imageLocations ) {

					// I am the image SRC values to preload.
					this.imageLocations = imageLocations;

					// As the images load, we'll need to keep track of the load/error
					// counts when announing the progress on the loading.
					this.imageCount = this.imageLocations.length;
					this.loadCount = 0;
					this.errorCount = 0;
					this.missingImages = [];
					// I am the possible states that the preloader can be in.
					this.states = {
						PENDING: 1,
						LOADING: 2,
						RESOLVED: 3,
						REJECTED: 4
					};

					// I keep track of the current state of the preloader.
					this.state = this.states.PENDING;

					// When loading the images, a promise will be returned to indicate
					// when the loading has completed (and / or progressed).
					this.deferred = $q.defer();
					this.promise = this.deferred.promise;

				}


				// ---
				// STATIC METHODS.
				// ---


				// I reload the given images [Array] and return a promise. The promise
				// will be resolved with the array of image locations.
				Preloader.preloadImages = function( imageLocations ) {

					var preloader = new Preloader( imageLocations );

					return( preloader.load() );

				};


				// ---
				// INSTANCE METHODS.
				// ---


				Preloader.prototype = {

					// Best practice for "instnceof" operator.
					constructor: Preloader,


					// ---
					// PUBLIC METHODS.
					// ---


					// I determine if the preloader has started loading images yet.
					isInitiated: function isInitiated() {

						return( this.state !== this.states.PENDING );

					},


					// I determine if the preloader has failed to load all of the images.
					isRejected: function isRejected() {

						return( this.state === this.states.REJECTED );

					},


					// I determine if the preloader has successfully loaded all of the images.
					isResolved: function isResolved() {

						return( this.state === this.states.RESOLVED );

					},


					// I initiate the preload of the images. Returns a promise.
					load: function load() {

						// If the images are already loading, return the existing promise.
						if ( this.isInitiated() ) {

							return( this.promise );

						}

						this.state = this.states.LOADING;

						
						var that = this;
						_.each(this.imageLocations, function(i){
							that.loadImageLocation(i)
						})	

						

						// Return the deferred promise for the load event.
						return( this.promise );

					},


					// ---
					// PRIVATE METHODS.
					// ---


					// I handle the load-failure of the given image location.
					handleImageError: function handleImageError( imageLocation ) {

						this.errorCount++;
						
						imageLocation.imageLoadError = true;
						this.missingImages.push(imageLocation.Images[0]._id)
						//this.failed[imageLocation._id] = true;
						//this.state = this.states.REJECTED;
						
						//this.deferred.reject( imageLocation );
						this.continueOrResolve()

					},


					// I handle the load-success of the given image location.
					handleImageLoad: function handleImageLoad( imageLocation ) {

						this.loadCount++;


						imageLocation.imageLoadSuccess = true;
						// Notify the progress of the overall deferred. This is different
						// than Resolving the deferred - you can call notify many times
						// before the ultimate resolution (or rejection) of the deferred.
				

						this.continueOrResolve()

					},
					
					continueOrResolve: function(){
						
						// If all of the images have loaded, we can resolve the deferred
						// value that we returned to the calling context.
						if ( this.loadCount + this.errorCount === this.imageCount ) {

							this.state = this.states.RESOLVED;

							this.deferred.resolve(this.missingImages );

						}
					},


					// I load the given image location and then wire the load / error
					// events back into the preloader instance.
					// --
					// NOTE: The load/error events trigger a $digest.
					loadImageLocation: function loadImageLocation( imageLocation ) {

						var preloader = this;

						// When it comes to creating the image object, it is critical that
						// we bind the event handlers BEFORE we actually set the image
						// source. Failure to do so will prevent the events from proper
						// triggering in some browsers.
						var image = $( new Image() )
							.load(
								function( event ) {

									// Since the load event is asynchronous, we have to
									// tell AngularJS that something changed.
									$rootScope.$apply(
										function() {

											preloader.handleImageLoad( imageLocation );

											// Clean up object reference to help with the
											// garbage collection in the closure.
											preloader = image = event = null;

										}
									);

								}
							)
							.error(
								function( event ) {

									// Since the load event is asynchronous, we have to
									// tell AngularJS that something changed.
									$rootScope.$apply(
										function() {

											preloader.handleImageError( imageLocation );

											// Clean up object reference to help with the
											// garbage collection in the closure.
											preloader = image = event = null;

										}
									);

								}
							)
							.prop( "src", appConstants.imageurl + imageLocation.Images[0].name + ".JPG" )
						;

					}

				};


				// Return the factory instance.
				return( Preloader );

			}
		);