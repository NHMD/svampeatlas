'use strict';

angular.module('svampeatlasApp')
	.factory('WMSservice', function($http, $cookies, $translate, KMS, MapBox, $q) {
		
		var kmsticket;
		var kmsticketPromise = KMS.getTicket().then(function(ticket){
			kmsticket = ticket;
		});
		var mapboxtoken;
		var mapboxtokenPromise = MapBox.getTicket().then(function(token){
			mapboxtoken = token;
		});
		


			return {
				getBaseLayers: function() {

					return $q.all([kmsticketPromise, mapboxtokenPromise]).then(function(){
						
						return {
						osm: {
							name: $translate.instant('Kort'),
							url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
							type: 'xyz'
						},
						OpenTopoMap: {
							name: 'OpenTopoMap',

							url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',

							type: 'xyz',
							layerOptions: {

								attribution: 'Tiles &copy; opentopomap.org'
							}

						},
						mapbox_outdoors: {
							name: 'Mapbox Outdoors',
							url: 'https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=' + mapboxtoken,
							type: 'xyz'

						},
						mapbox_satelite: {
							name: 'Mapbox Satelite',
							url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=' + mapboxtoken,
							type: 'xyz'

						},
						topo_25: {
							name: $translate.instant("DK 4cm kort"),
							type: 'wms',
							visible: true,
							url: "https://kortforsyningen.kms.dk/topo_skaermkort",
							layerOptions: {
								layers: "topo25_klassisk",
								servicename: "topo25",
								version: "1.1.1",
								request: "GetMap",
								format: "image/jpeg",
								service: "WMS",
								styles: "default",
								exceptions: "application/vnd.ogc.se_inimage",
								jpegquality: "80",
								attribution: "Indeholder data fra GeoDatastyrelsen, WMS-tjeneste",
								ticket: kmsticket
							}
						},
						luftfoto: {
							name: $translate.instant("DK luftfoto"),
							type: 'wms',
							visible: true,
							url: "https://kortforsyningen.kms.dk/topo_skaermkort",
							layerOptions: {
								layers: "orto_foraar",
								servicename: "orto_foraar",
								version: "1.1.1",
								request: "GetMap",
								format: "image/jpeg",
								service: "WMS",
								styles: "default",
								exceptions: "application/vnd.ogc.se_inimage",
								jpegquality: "80",
								attribution: "Indeholder data fra GeoDatastyrelsen, WMS-tjeneste",
								ticket: kmsticket
							}
						}
					
					}
					})
					}
				}
			
			});
