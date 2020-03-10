

var GeoJSONservice = require('./GeoJSON.service')


var req = {
	body: { observationDate: '2019-10-21',
  os: 'Android',
  browser: 'Native App',
  substrate_id: 1,
  vegetationtype_id: 18,
  associatedOrganisms: [],
  decimalLatitude: 52.165625360858144,
  decimalLongitude: 4.474667608737946,
  accuracy: 5,
  geonameId: 9254605,
  geoname: 
   { geonameId: 9254605,
     name: 'Ibis Leiden Centre',
     adminName1: 'South Holland',
     lat: '52.164',
     lng: '4.481',
     countryName: 'Netherlands',
     countryCode: 'NL',
     fcodeName: 'hotel',
     fclName: 'spot, building, farm' },
  determination: 
   { confidence: 'sikker',
     taxon_id: 14607,
     user_id: 60,
     notes: '#imagevision_score: 98.76; #imagevision_list: Helvella crispa (98.76), Clavaria falcata (0.56), Clavulina rugosa (0.13), Leucocybe connata (0.11), Cuphophyllus virgineus sensu lato (0.05), Helvella elastica i bred forstand  (0.04), Helvella lacunosa (0.03), Coprinus comatus (0.02), Gyromitra gigas (0.02), Neohygrocybe ingrata (0.02)' },
  users: 
   [ { _id: 60,
       Initialer: 'TSJ',
       facebook: '10206851531266554',
       name: 'Thomas Stjernegaard Jeppesen' } ],
  primaryuser_id: 60,
  geom: 
    {
     fn: 'GeomFromText',
     args: [ 'POINT (4.474667608737946 52.165625360858144)' ] } }
}



			if(req.body.geoname && !req.body.verbatimLocality ){
				
				console.log(Number(req.body.decimalLatitude))
				console.log(Number(req.body.decimalLongitude))
				console.log(Number(req.body.geoname.lat))
				console.log(Number(req.body.geoname.lng))
				
				
				var direction = GeoJSONservice.direction(
					{
						lat: Number(req.body.decimalLatitude), 
						lng: Number(req.body.decimalLongitude) 
					}, 
					{
						lat: Number(req.body.geoname.lat), 
						lng: Number(req.body.geoname.lng)
					}
					);

				req.body.verbatimLocality = req.body.geoname.countryName + ", " + req.body.geoname.adminName1 + ", " + (Math.round(Number(req.body.geoname.distance) * 1000)) + " m " + direction + " " + req.body.geoname.name + " (" + req.body.geoname.fcodeName + ")";
			}
			
			
			
			
console.log(req.body.verbatimLocality)			