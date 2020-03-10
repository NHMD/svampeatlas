/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';


var config = require('../../../config/environment');
var models = require('../../mysql')
'use strict';

var _ = require('lodash');

var mysql = require('mysql')
var Promise = require('bluebird')
var rp = require("request-promise");




const RANKS = {
	"gen." : "GENUS",
	"fam." : "FAMILY",
	"subclass.": "SUBCLASS",
	"class.": "CLASS",
	"ord.": "PHYLUM",
	"phyl.": "PHYLUM"
} 

const RANK_IDS = {
	"GENUS" : 5000,
	"FAMILY": 4000,
	"ORDER": 3000,
	"CLASS": 2000
}

var eachLimit =  (collection, limit, iteratorFunction) => {
	
	return Promise.map(collection, iteratorFunction, {concurrency: limit})
	
/*	let index = 0;
	let result = []
	while (index < collection.length) {
	  let partialResult = await Promise.all(collection.slice(index, index + limit).map(iteratorFunction))
	result.concat(partialResult)		
	  index += limit;
	}
	return result */
  }

var queryFunIndex =  (record, client) =>{

	
	 return client.NameByKeyAsync({NameKey: record.taxonFunID})
		.then(result => {
			var r = ( result && result.NameByKeyResult && result.NameByKeyResult.NewDataSet && result.NameByKeyResult.NewDataSet.IndexFungorum) ? result.NameByKeyResult.NewDataSet.IndexFungorum : undefined;
			console.log(r)

		})
		.catch(err => {
			console.log(err)
		})  

}

var queryGbif = (record) =>{

	return rp.get(`https://api.gbif.org/v1/species/match2?name=${encodeURIComponent(record.taxon)}&verbose=true`, {json:true}).then(function(res){
		// parsed response body as js object 
		let data;
		if(res.classification && res.classification.length > 1 && ['Fungi', 'Protozoa'].includes(res.classification[0].name) ){
			data = res;
		} else if(_.get(res, 'diagnostics.alternatives'))  {
		//	console.log(`######## ${record.taxon}`)
		//	console.log(res.diagnostics.alternatives[0].classification[0].name)
			let alternatives = res.diagnostics.alternatives.filter(a => {
				return ['Fungi', 'Protozoa'].includes(_.get(a, 'classification[0].name')) && (_.get(a, 'diagnostics.matchType') === 'EXACT')
			});
//console.log(`Alternatives ${alternatives}`)
			if(alternatives && alternatives.length > 0){
				data = alternatives[0]
			}
		} ;
		if(data && data.classification && data.classification.length > 1){

			if((data.classification[data.classification.length -2].rank === RANKS[record.parentRank]) && data.classification[data.classification.length -2].name !== record.parent){
				// console.log(`${record.status} ${record.taxon} exsiting parent: ${record.parent} => new parent: ${data.classification[data.classification.length -2].name}`)
			return `${record.taxon};${record.status};${record.grandParent};${record.parent};${data.classification[data.classification.length-2].name};${data.classification.map(t => t.name).join(' > ')};parent mismatch;https://svampe.databasen.org/taxon/${record._id};https://www.gbif.org/species/${data.classification[data.classification.length -1].key}\n`
			} else if( (data.classification[data.classification.length -2].rank === RANKS[record.grandParentRank]) && data.classification[data.classification.length -2].name !== record.grandParent){
				// console.log(`${record.status} ${record.taxon} exsiting grandparent: ${record.grandParent} => new grandparent: ${data.classification[data.classification.length -2].name}`)
				return `${record.taxon};${record.status};${record.grandParent};${record.parent};${data.classification[data.classification.length-2].name};${data.classification.map(t => t.name).join(' > ')};grandparent mismatch;;https://svampe.databasen.org/taxon/${record._id};https://www.gbif.org/species/${data.classification[data.classification.length -1].key}\n`
			} else {
				return;
			}
			
		} else {
			return;
		}
	}).catch((err)=>{
		console.log("ERR")
		console.log(err)
	});

}


function getTaxa(rankId) {
	
	var sql = 'select t._id, IF(t._id=t.accepted_id, "ACCEPTED", "SYNONYM") as status, t.FullName as taxon, t.FunIndexNumber as taxonFunID, p.FullName as parent, gp.FullName as grandParent, gp.RankName as grandParentRank, p.RankName as parentRank, p.FunIndexNumber as parentFunID from Taxon t, Taxon p, Taxon gp where p._id = t.parent_id AND gp._id=p.parent_id AND  t.RankID = :rankId;'
	return models.sequelize.query(sql, {
		replacements: {
			rankId: rankId
			
		},
		type: models.sequelize.QueryTypes.SELECT
	})


	.then((result) => {
		
		return eachLimit(result, 25, queryGbif)

	})
	.then(res => {
		let headers = `taxon;status;grandParent;parent;proposedParent;proposedClassification;mismatch;svampeatlasLink;gbifLink\n`;
		return [headers].concat(res).join('');
	})
	
}

exports.classificationDiff = (req, res) => {
	const rankId = RANK_IDS[req.params.rank];
	
	if(!rankId){
		return res.status(404);
	} else {
		
		return getTaxa(rankId)
				.then(csv => {
					res.set({
					  'Content-Type': 'text/csv'
					})
					res.status(200).send(csv)
				})
				.catch(err => {
					res.status(500).send(err.message)
				})
				
	}
}
