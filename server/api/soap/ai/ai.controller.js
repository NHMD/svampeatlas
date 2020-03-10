/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';
var Promise = require("bluebird");
var models = require('../../mysql')
var Taxon = models.Taxon;
var specieslist = require('./species.json')
var _ = require('lodash');
var Client = require('node-rest-client').Client;
var client = new Client();
client.registerMethod("getMatches", "https://cw.felk.cvut.cz/predict", "POST");
const https = require('https');
var config = require('../../../config/environment');
const rootCas = require('ssl-root-cas/latest').create();
rootCas.addFile(__dirname + '/TERENA_SSL_CA_3.pem');

https.globalAgent.options.ca = rootCas;


function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		console.log(err);
		res.status(statusCode).send(err);
	};
}

function responseWithResult(res, statusCode) {
	statusCode = statusCode || 200;
	return function(entity) {
		if (entity) {
			return res.status(statusCode).json(entity);
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

const findSimilarTaxa = (_id) => {



 return   models.SimilarTaxa.findAll({
      where: { $or: [{ taxon1_id: _id}, { taxon2_id: _id}] },
	  include: [{
	  	model: models.Taxon,
		  as: "Taxon1" ,
		  attributes: ['_id', 'accepted_id'],
		  include: [{
		  	model: models.Taxon,
			  as: "acceptedTaxon" , 
			  attributes: ['_id', 'FullName'],
			  include: [{
			  	model: models.TaxonDKnames,
				  as: "Vernacularname_DK",
				  attributes: ["vernacularname_dk"]    
			  }] 
		  }] 
	  },{
	  	model: models.Taxon,
		  as: "Taxon2"  ,
		  attributes: ['_id', 'accepted_id'],
		  include: [{
		  	model: models.Taxon,
			  as: "acceptedTaxon"  , 
			  attributes: ['_id', 'FullName'],
			  include: [{
			  	model: models.TaxonDKnames,
				  as: "Vernacularname_DK",
				  attributes: ["vernacularname_dk"]  
			  }] 
		  }] 
	  }]
    })
}

const getInclude = (req) => {

	if (req.query.include) {
		var include = JSON.parse(req.query.include)

		return  _.map(include, function(n) {
			
			n.model = models[n.model];
			if (n.where) {
				n.where = JSON.parse(n.where);

				if (n.where.$and && n.where.$and.length > 0) {

					for (var i = 0; i < n.where.$and.length; i++) {
						n.where.$and[i] = JSON.parse(n.where.$and[i]);
					}
				}
				

			}
			
			if(n.include){
				var nestedinclude = JSON.parse(n.include);
					
				if(nestedinclude.model !== 'User'){
					nestedinclude.model = models[nestedinclude.model];
					nestedinclude.where = JSON.parse(nestedinclude.where);
					n.include = nestedinclude;
					
					
				}
			}
			
			return n;
		});
		
	
	} else {
		return undefined
	}
}

const showAcceptedTaxon = function(_ids, include) {

return	Taxon.findAll({
	where: {
		_id: {$in: _ids }
	},
	attributes: ['_id', 'accepted_id'],
	include: include || [
		
	 {
		model: models.Taxon,
		as: "acceptedTaxon",
	 	include: [{
	 			model: models.TaxonDKnames,
	 			as: "Vernacularname_DK",
	 			attributes: ["vernacularname_dk"],
	 			required: false
	 		},
	 		{
	 			model: models.TaxonRedListData,
	 			as: "redlistdata",
	 			attributes: ['status'],
	 			where: {year: 2009},
	 			required: false
	 		},
	 		{
	 			model: models.TaxonImages,
	 			as: "images",
	 			required: false
	 		}, 
	 		 {
	 			model: models.Taxon,
	 			as: "Parent",
	 			 attributes: ['_id', 'FullName']
	 		}, {
	 			model: models.Taxon,
	 			as: "synonyms",
	 			required: false,
	 			include: [{
	 			model: models.TaxonImages,
	 			as: "images",
	 				required: false
	 		}]
	 		}, {
	 			model: models.TaxonAttributes,
	 			as: "attributes",
	 			attributes: ['bogtekst_gyldendal', 'bogtekst_gyldendal_en','PresentInDK', 'spiselighedsrapport', 'vernacular_name_GB']
	 		}, {
	 			model: models.TaxonStatistics,
	 			as: "Statistics"
	 		}, {
	 			model: models.MorphoGroup,
	 			as: "MorphoGroup"
	 		}

	 	]
	}
		
	]

	})

	;
};



 exports.getMatches = function(req, res) {
	

		
	client.methods.getMatches({headers: {'User-Agent': req.headers['user-agent']}, data: req.body}, 
	
	function(data,response){
		
		const prediction = data.predictions[0];
		const result = specieslist.map((sp, idx ) => ( _.merge({}, sp, {score: prediction[idx]} ))).sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.score > b.score) ? 1 : -1) : -1 )
		
		const limit = req.query.limit ? req.query.limit : 10;
		const resultlist = result.slice(0,limit);
		const resultMap = _.mapValues(_.keyBy(resultlist, '_id'), 'score')
		return showAcceptedTaxon(resultlist.map(r => r._id), getInclude(req))
				.then((taxa)=>{
					_.each(taxa, t => {
						
						t.score = resultMap[t._id];
					})
					return taxa.map(t => {
						let taxon = t.get({ plain: true })
						taxon.score = resultMap[t._id];
						return taxon
					}).sort((a, b) => b.score - a.score)
				})
				.then(taxa => {
					 return Promise.all(taxa.map(t => {
						const id = t.acceptedTaxon ? t.acceptedTaxon._id : t._id
						return findSimilarTaxa(id)
						.then((sim)=> {
							if(t.acceptedTaxon){
									t.acceptedTaxon.similarTaxa = sim;
							} else {
									t.similarTaxa = sim;
							}
								
							})
							} ))
							.then(() => res.status(response.statusCode).json(taxa.sort()))
					
			
				}) 

	}
, function(err){
		return res.status(404)
	});
 
}; 




