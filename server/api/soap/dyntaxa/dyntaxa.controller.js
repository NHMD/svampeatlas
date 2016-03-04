/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

var config = require('../../../config/environment');
var request = require("request");
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var Promise = require('bluebird');
Promise.promisifyAll(parser);

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.send(statusCode, err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.json(statusCode, entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.send(404);
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(function() {
          return res.send(204);
        });
    }
  };
}

// Get list of things
exports.NameSearch = function(req, res) {
	var token =  req.headers.dyntaxaauthorization;
	var operator = (req.query.operator) ? req.query.operator  : "BeginsWith";
	var searchString = req.query.searchstring;
	
	
	var body = 
	'<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:WebServices.ArtDatabanken.slu.se" xmlns:art="http://schemas.datacontract.org/2004/07/ArtDatabanken.WebService.Data" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:art1="http://schemas.datacontract.org/2004/07/ArtDatabanken.Data">'
  +'<soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">'
+'<wsa:To>https://taxon.artdatabankensoa.se/TaxonService.svc/SOAP12</wsa:To>'
+'<wsa:Action>urn:WebServices.ArtDatabanken.slu.se/ITaxonService/GetTaxonNamesBySearchCriteria</wsa:Action>'
+'</soap:Header>' 
  +'<soap:Body>'
      +'<urn:GetTaxonNamesBySearchCriteria>'
        +'<urn:clientInformation>'   
+'<art:Token>'+token+'</art:Token>'
         +'</urn:clientInformation>'
         +'<urn:searchCriteria>'
            +'<art:NameSearchString>'
               +'<art:CompareOperators>'
                  +'<art1:StringCompareOperator>'+operator+'</art1:StringCompareOperator>'
               +'</art:CompareOperators>'
              + '<art:SearchString>'+searchString+'</art:SearchString>'
            +'</art:NameSearchString>'
         +'</urn:searchCriteria>'
      +'</urn:GetTaxonNamesBySearchCriteria>'
   +'</soap:Body>'
+'</soap:Envelope>';
	
	
var headers = {
	'Content-Type': 'application/soap+xml; charset=utf-8',
	'Content-Length': body.length,
	'SOAPAction': "urn:WebServices.ArtDatabanken.slu.se/ITaxonService/GetTaxonNamesBySearchCriteria"
}


request({url:'https://Taxon.ArtDatabankenSoa.se/TaxonService.svc/SOAP12', method: "POST", body: body, headers: headers}, function(err, response, body){
	if(err) {console.log(err)};
	
	if(parseInt(response.statusCode) === 200){
	var xml = /<s:Body>([\s\S])*?<\/s:Body>/.exec(body)[0]
	parser.parseString(xml, function (err, result) {
		if(err) {console.log(err)};
			res.status(200).json(result['s:Body']['GetTaxonNamesBySearchCriteriaResponse'][0]['GetTaxonNamesBySearchCriteriaResult'][0]['b:WebTaxonName'])
		// ['s:Body']['GetTaxonNamesBySearchCriteriaResponse'][0]['GetTaxonNamesBySearchCriteriaResult'][0]['b:WebTaxonName']
	    });
	} else {
		res.send(response.statusCode, body);
	}

})
};

function findDynTaxaIdByTaxonByName (token, searchString, cb) {
	
	var body = 
	'<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:WebServices.ArtDatabanken.slu.se" xmlns:art="http://schemas.datacontract.org/2004/07/ArtDatabanken.WebService.Data" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:art1="http://schemas.datacontract.org/2004/07/ArtDatabanken.Data">'
	     +'<soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">'
	+'<wsa:To>https://taxon.artdatabankensoa.se/TaxonService.svc/SOAP12</wsa:To>'
	+'<wsa:Action>urn:WebServices.ArtDatabanken.slu.se/ITaxonService/GetTaxaBySearchCriteria</wsa:Action>'
	+'</soap:Header>'
	   +'<soap:Body>'
	      +'<urn:GetTaxaBySearchCriteria>'
	         +'<urn:clientInformation>'
	            +'<art:Token>'+token+'</art:Token>'
	         +'</urn:clientInformation>'
	         +'<urn:searchCriteria>'
	           +' <art:TaxonNameSearchString>'
	               +'<art:CompareOperators>'
	                  +'<art1:StringCompareOperator>Equal</art1:StringCompareOperator>'
	               +'</art:CompareOperators>'
	              +' <art:SearchString>'+searchString+'</art:SearchString>'
	           +' </art:TaxonNameSearchString>'
	        +' </urn:searchCriteria>'
	     +' </urn:GetTaxaBySearchCriteria>'
	  +' </soap:Body>'
	+'</soap:Envelope>'
	
	
var headers = {
	'Content-Type': 'application/soap+xml; charset=utf-8',
	'Content-Length': body.length,
	'SOAPAction': "urn:WebServices.ArtDatabanken.slu.se/ITaxonService/GetTaxaBySearchCriteria"
}

var data = '';

request({url:'https://Taxon.ArtDatabankenSoa.se/TaxonService.svc/SOAP12', method: "POST", body: body, headers: headers}, function(err, response, body){
	if(err) {console.log(err)};
	
	if(parseInt(response.statusCode) === 200){
	  var xml = /<s:Body>([\s\S])*?<\/s:Body>/.exec(body)[0]
		
		
	parser.parseString(xml, function (err, result) {
		
		if(err) {
			console.log(err)
		};
		if(result['s:Body']['GetTaxaBySearchCriteriaResponse'][0]['GetTaxaBySearchCriteriaResult'][0]['b:WebTaxon'] !== undefined){
			var taxon;
			if(result['s:Body']['GetTaxaBySearchCriteriaResponse'][0]['GetTaxaBySearchCriteriaResult'][0]['b:WebTaxon'].length > 1){
				taxon =	_.find(result['s:Body']['GetTaxaBySearchCriteriaResponse'][0]['GetTaxaBySearchCriteriaResult'][0]['b:WebTaxon'], (e)=>{
								
								return e["b:ScientificName"][0] === searchString;
							});
			} else {
				taxon = result['s:Body']['GetTaxaBySearchCriteriaResponse'][0]['GetTaxaBySearchCriteriaResult'][0]['b:WebTaxon'][0]
			}
			 

			if(taxon){
				cb(taxon["b:Id"][0])
			} else {
				cb("")
			}
		} else {
			cb("")
		}

	    });
	
	} else {
		cb("")
	}

});

};

exports.GetTaxonNameStatuses = function(req, res){
	var token =  req.headers.dyntaxaauthorization;	
	var body =
	'<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:WebServices.ArtDatabanken.slu.se" xmlns:art="http://schemas.datacontract.org/2004/07/ArtDatabanken.WebService.Data" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'
	  +'<soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">'
	+'<wsa:To>https://taxon.artdatabankensoa.se/TaxonService.svc/SOAP12</wsa:To>'
	+'<wsa:Action>urn:WebServices.ArtDatabanken.slu.se/ITaxonService/GetTaxonNameStatuses</wsa:Action>'
	+'</soap:Header>'
	   +'<soap:Body>'
	      +'<urn:GetTaxonNameStatuses>'
	         +'<urn:clientInformation>'
	            +'<art:Token>'+token+'</art:Token>'
	         +'</urn:clientInformation>'
	      +'</urn:GetTaxonNameStatuses>'
	   +'</soap:Body>'
	+'</soap:Envelope>';
	
	var headers = {
		'Content-Type': 'application/soap+xml; charset=utf-8',
		'Content-Length': body.length,
		'SOAPAction': "urn:WebServices.ArtDatabanken.slu.se/ITaxonService/GetTaxonNameStatuses"
	}
	request({url:'https://Taxon.ArtDatabankenSoa.se/TaxonService.svc/SOAP12', method: "POST", body: body, headers: headers}, function(err, response, body){
		
		if(err) {console.log(err)};

		if(parseInt(response.statusCode) === 200){
		  var xml = /<s:Body>([\s\S])*?<\/s:Body>/.exec(body)[0]
			
		parser.parseStringAsync(xml).then(function (result) {
		
				res.status(200).json(result['s:Body']['GetTaxonNameStatusesResponse'][0]['GetTaxonNameStatusesResult'][0]['b:WebTaxonNameStatus'])
			// ['s:Body']['GetTaxonNamesByTaxonIdResponse'][0]['GetTaxonNamesByTaxonIdResult'][0]['b:WebTaxonName']
		    });
		} else {
			res.status(response.statusCode).send(body);
		}

	});
	
};

exports.GetTaxonNameCategories = function(req, res){
    var token =  req.headers.dyntaxaauthorization;	
	var body =
	'<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:WebServices.ArtDatabanken.slu.se" xmlns:art="http://schemas.datacontract.org/2004/07/ArtDatabanken.WebService.Data" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'
	  +'<soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">'
	+'<wsa:To>https://taxon.artdatabankensoa.se/TaxonService.svc/SOAP12</wsa:To>'
	+'<wsa:Action>urn:WebServices.ArtDatabanken.slu.se/ITaxonService/GetTaxonNameCategories</wsa:Action>'
	+'</soap:Header>'
	   +'<soap:Body>'
	      +'<urn:GetTaxonNameCategories>'
	         +'<urn:clientInformation>'
	            +'<art:Token>'+token+'</art:Token>'
	         +'</urn:clientInformation>'
	      +'</urn:GetTaxonNameCategories>'
	   +'</soap:Body>'
	+'</soap:Envelope>';
	
	var headers = {
		'Content-Type': 'application/soap+xml; charset=utf-8',
		'Content-Length': body.length,
		'SOAPAction': "urn:WebServices.ArtDatabanken.slu.se/ITaxonService/GetTaxonNameCategories"
	}
	request({url:'https://Taxon.ArtDatabankenSoa.se/TaxonService.svc/SOAP12', method: "POST", body: body, headers: headers}, function(err, response, body){
		
		if(err) {console.log(err)};
		console.log(response.statusCode)
		if(parseInt(response.statusCode) === 200){
		  var xml = /<s:Body>([\s\S])*?<\/s:Body>/.exec(body)[0]
	
		parser.parseStringAsync(xml).then(function (result) {
		
				res.status(200).json(result['s:Body']['GetTaxonNameCategoriesResponse'][0]['GetTaxonNameCategoriesResult'][0]['b:WebTaxonNameCategory'])
			// ['s:Body']['GetTaxonNamesByTaxonIdResponse'][0]['GetTaxonNamesByTaxonIdResult'][0]['b:WebTaxonName']
		    });
		} else {
			res.status(response.statusCode).send(body);
		}

	});
	
};

exports.SynonymSearch = function(req, res) {
	var searchString = req.query.searchstring;
   var token =  req.headers.dyntaxaauthorization;	
	//console.log("taxonid "+taxonid)


try {
	findDynTaxaIdByTaxonByName(token, searchString, function(taxonid){
		if(!taxonid){
			res.status(404).send("");
			
		}
		else {
		var body = 
		'<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:WebServices.ArtDatabanken.slu.se" xmlns:art="http://schemas.datacontract.org/2004/07/ArtDatabanken.WebService.Data" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">'
		  +'<soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">'
		+'<wsa:To>https://taxon.artdatabankensoa.se/TaxonService.svc/SOAP12</wsa:To>'
		+'<wsa:Action>urn:WebServices.ArtDatabanken.slu.se/ITaxonService/GetTaxonNamesByTaxonId</wsa:Action>'
		+'</soap:Header>'
		   +'<soap:Body>'
		      +'<urn:GetTaxonNamesByTaxonId>'
		        +'<urn:clientInformation>'
		            +'<art:Token>'+token+'</art:Token>'
		         +'</urn:clientInformation>'
		         +'<urn:taxonId>'+taxonid+'</urn:taxonId>'
		     +'</urn:GetTaxonNamesByTaxonId>'
		   +'</soap:Body>'
		+'</soap:Envelope>';
	
	
	var headers = {
		'Content-Type': 'application/soap+xml; charset=utf-8',
		'Content-Length': body.length,
		'SOAPAction': "urn:WebServices.ArtDatabanken.slu.se/ITaxonService/GetTaxonNamesByTaxonId"
	}
	
	request({url:'https://Taxon.ArtDatabankenSoa.se/TaxonService.svc/SOAP12', method: "POST", body: body, headers: headers}, function(err, response, body){
		if(err) {console.log(err)};
		
		if(parseInt(response.statusCode) === 200){
		  var xml = /<s:Body>([\s\S])*?<\/s:Body>/.exec(body)[0]
			
		parser.parseStringAsync(xml).then(function (result) {
		
				res.status(200).json(result['s:Body']['GetTaxonNamesByTaxonIdResponse'][0]['GetTaxonNamesByTaxonIdResult'][0]['b:WebTaxonName'])
			
		    });
		} else {
			res.status(response.statusCode).send( body);
		}

	});
}
	
	})
} catch (err) {
	res.send(err.statusCode , err.body)
}



};


exports.GetToken = function(req, res) {
	login(function(token){
		res.status(200).json({access_token: token})
	})

};

function login(cb){
	var body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:WebServices.ArtDatabanken.slu.se">'
   +'<soapenv:Header/>'
   +'<soapenv:Body>'
      +'<urn:Login>'
         +'<urn:userName>'+config.dyntaxa.UserName+'</urn:userName>'
         +'<urn:password>'+config.dyntaxa.Password+'</urn:password>'
         +'<urn:applicationIdentifier>'+config.dyntaxa.ApplicationIdentifier+'</urn:applicationIdentifier>'
      +'</urn:Login>'
   +'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var headers = {
		'Content-Type': 'text/xml; charset=utf-8',
		'Content-Length': body.length,
		'SOAPAction': "urn:WebServices.ArtDatabanken.slu.se/ITaxonService/Login"
	}
	
	request({url:'https://Taxon.ArtDatabankenSoa.se/TaxonService.svc', method: "POST", body: body, headers: headers}, function(err, response, body){
		if(err) {console.log(err)};
		//console.log(response.statusCode, body);
		parser.parseString(body, function (err, result) {
		        var token = result['s:Envelope']['s:Body'][0]['LoginResponse'][0]['LoginResult'][0]['a:Token'][0];
		        cb(token)
		    });
	})
}
