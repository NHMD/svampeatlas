'use strict';

angular.module('svampeatlasApp')
	.factory(
			"preloader",
			function( $q, $rootScope, appConstants ) {

				// I manage the preloading of image objects. Accepts an array of image URLs.
				function Preloader( observations ) {
					var that = this;
					// I am the image SRC values to preload.
					this.observations = observations;

					// As the images load, we'll need to keep track of the load/error
					// counts when announing the progress on the loading.
					// if theres only one observation, we should load all images from that single obs.
					this.imageCount;
					if(this.observations.length > 1){
						that.imageCount = that.observations.length 
					} else if(this.observations[0] && this.observations[0].Images){
						that.imageCount = that.observations[0].Images.length;
					} else {
						that.imageCount = 0
					};
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
				Preloader.preloadImages = function( observations ) {

					var preloader = new Preloader( observations );

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
						
						if(this.observations.length > 1){
							_.each(this.observations, function(obs){
								if(obs.Images.length > 0){
									that.loadimage(obs.Images[0]);
								} else {
									that.errorCount++;
									that.continueOrResolve();
								};
							})
						} else if(this.observations[0] && this.observations[0].Images) {
							_.each(this.observations[0].Images, function(img){
								that.loadimage(img)
							})
						}
							

						

						// Return the deferred promise for the load event.
						return( this.promise );

					},


					// ---
					// PRIVATE METHODS.
					// ---


					// I handle the load-failure of the given image location.
					handleImageError: function handleImageError( imgref ) {

						this.errorCount++;
						
						imgref.imageLoadError = true;
						this.missingImages.push(imgref._id)
						//this.failed[observation._id] = true;
						//this.state = this.states.REJECTED;
						
						//this.deferred.reject( observation );
						this.continueOrResolve()

					},


					// I handle the load-success of the given image location.
					handleImageLoad: function handleImageLoad( imgref ) {

						this.loadCount++;


						imgref.imageLoadSuccess = true;
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
					loadimage: function loadimage( imgref ) {

						var preloader = this;
						
						var uri = (imgref.name) ? (appConstants.imageurl + imgref.name + ".JPG") : imgref.uri;
						// When it comes to creating the image object, it is critical that
						// we bind the event handlers BEFORE we actually set the image
						// source. Failure to do so will prevent the events from proper
						// triggering in some browsers.
						
						var image = $( new Image() )
							.on('load',
								function( event ) {
									imgref.width = this.width;
									imgref.height = this.height;
									// Since the load event is asynchronous, we have to
									// tell AngularJS that something changed.
									$rootScope.$apply(
										function() {

											preloader.handleImageLoad( imgref );

											// Clean up object reference to help with the
											// garbage collection in the closure.
											preloader = image = event = null;

										}
									);

								}
							)
							.on('error',
								function( event ) {

									// Since the load event is asynchronous, we have to
									// tell AngularJS that something changed.
									$rootScope.$apply(
										function() {

											preloader.handleImageError( imgref );

											// Clean up object reference to help with the
											// garbage collection in the closure.
											preloader = image = event = null;

										}
									);

								}
							)
							.prop( "src",uri )
						;

					}

				};


				// Return the factory instance.
				return( Preloader );

			}
		);