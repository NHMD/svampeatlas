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
var models = require('../')
var MycokeyCharacter = models.MycokeyCharacter;

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

// Get list of things
exports.index = function(req, res) {
	var query = {
		offset: req.query.offset,
		limit: req.query.limit,
		order: req.query.order
	};
	if (req.query.where) {
		query['where'] = JSON.parse(req.query.where);
	}

	if (req.query.include) {
		var include = JSON.parse(req.query.include)
		
	query['include'] =	_.map(include, function(n){
		n.model = models[n.model];
		if(n.where) {
			n.where = JSON.parse(n.where)
		}
		return n;
		})	
	} else {
		query['include'] = [{model: models.MycokeyCharacterGroup, as: "charactergroup" }]
	}
	
MycokeyCharacter.findAndCount(query)
	.then(function(character) {
		res.set('count', character.count);
		if (req.query.offset) {
			res.set('offset', req.query.offset);
		};
		if (req.query.limit) {
			res.set('limit', req.query.limit);
		};

		return res.status(200).json(character.rows);
	})
	.
catch (handleError(res));
};

// Get a single thing
exports.show = function(req, res) {
  MycokeyCharacter.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};




// Get list of things
exports.indexGroups = function(req, res) {

	
models.MycokeyCharacterGroup.findAll()
	.then(function(groups) {

		return res.status(200).json(groups);
	})
	.
catch (handleError(res));
};
/*
exports.showMycoKeyCharacters = function(req, res) {
	
	//TaxonTag
	models.Taxon.find({
		where: {
			_id: req.params.id
		},
		include: [ {
				model: models.MycokeyCharacterView,
				as: 'character1'
			}

		]
	})
		.then(handleEntityNotFound(res))
		.then(function(taxon){
			return res.status(200).json(taxon.character1);
		})
		.
	catch (handleError(res));
};

exports.addMycoKeyCharacter= function(req, res) {

//return res.status(200).json(req.body);
 var sql = "INSERT INTO GenusCharacters (`Character`, `GenusID`, `xxxx`,`BoolValue`, Probability, mark, CodedForSpecies, `check`, `RealValueMax`, `RealValueMin`, `taxon_id`) "
+"	SELECT :CharacterID, 0, 1, 1, 100, 0, 0, 0, 0, 0,  t._id "
+" FROM Taxon t, Taxon tp WHERE tp._id = :id AND t.Path LIKE CONCAT(tp.Path, '%') ON DUPLICATE KEY UPDATE taxon_id=taxon_id";

return models.sequelize.query(sql,
  { replacements: { CharacterID: req.body.CharacterID, id: req.params.id }, type: models.sequelize.QueryTypes.INSERT }
).then(function(inserted) {

  return models.Taxon.find({where: {_id:req.params.id}})
})
.then(function(taxon) {

 return  models.TaxonLog.create({
			eventname: "MycoKey character added",
			description: "Character '"+req.body['Short text UK']+"' (id: "+req.body['CharacterID']+") added to "+ taxon.FullName + " (id: "+taxon._id+") and its descendants.",
			user_id: req.user._id,
			taxon_id: taxon._id
	
		})
})

.then(function(inserted) {

  return res.status(201).json(inserted);
}).catch(handleError(res));


};

exports.deleteMycoKeyCharacter = function(req, res) {


 var sql = "DELETE FROM GenusCharacters "
+"	WHERE `Character` = :CharacterID AND taxon_id IN "
+"(SELECT t._id FROM Taxon t, Taxon tp WHERE tp._id = :id AND t.Path LIKE CONCAT(tp.Path, '%'))";

return models.sequelize.query(sql,
  { replacements: { CharacterID: parseInt(req.params.characterid), id: parseInt(req.params.id) }, type: models.sequelize.QueryTypes.DELETE }
)
.then(function(inserted) {

  return [models.Taxon.find({where: {_id:req.params.id}}), MycokeyCharacter.find({where: {CharacterID:req.params.characterid}})]
})
.spread(function(taxon, character) {

 return  models.TaxonLog.create({
			eventname: "MycoKey character removed",
			description: "Character '"+character['Short text UK']+"' (id: "+character['CharacterID']+") removed from "+ taxon.FullName + " (id: "+taxon._id+") and its descendants.",
			user_id: req.user._id,
			taxon_id: taxon._id
	
		})
})
.then(function(deleted) {

  return res.status(200).json(deleted);
}).catch(handleError(res));

};

exports.importMycoKeyCharacters = function(req, res){
	
	var sql = "INSERT INTO GenusCharacters (`Character`, `GenusID`, `xxxx`,`BoolValue`, Probability, mark, CodedForSpecies, `check`, `RealValueMax`, `RealValueMin`, `taxon_id`) "
	+ "SELECT c.`Character`, 0, 1, c.BoolValue, c.Probability, c.mark, c.CodedForSpecies, c.`check`, c.RealValueMax, c.RealValueMin,  t._id"
	+"  FROM GenusCharacters c, Taxon t, Taxon tp WHERE c.taxon_id = :importfromid AND tp._id = :taxonId AND t._id <> c.taxon_id AND t.Path LIKE CONCAT(tp.Path, '%') ON DUPLICATE KEY UPDATE taxon_id=c.taxon_id"
	
	return models.sequelize.query(sql,
	  { replacements: { taxonId: req.params.id, importfromid: req.body._id }, type: models.sequelize.QueryTypes.INSERT }
	)
	
	
	.then(function(inserted) {
		
	  return models.Taxon.find({
		where: {
			_id: req.params.id
		},
		include: [ {
				model: models.MycokeyCharacterView,
				as: 'character1'
			}

		]
	})
	})
	.then(function(taxon) {

	 return  [taxon, models.TaxonLog.create({
				eventname: "MycoKey characters imported",
				description: taxon.character1.length+ " MycoKey characters imported from "+req.body.FullName+" (id: "+req.body._id+")  to "+ taxon.FullName + " (id: "+taxon._id+") and its descendants.",
				user_id: req.user._id,
				taxon_id: taxon._id
	
			})]
	})
	.spread(function(taxon) {
		
	  return res.status(201).json(taxon.character1);
	}).catch(handleError(res));
	
}


*/

exports.batchAddMycokeyCharacter = function(req, res) {
		
	var promises = [];
	
	_.each(req.body, function(e){
		promises.push(models.MycokeyGenusCharacter.upsert({taxon_id: e._id, Character: req.params.id }));
	})
	
	return Promise.all(promises)
	.then(function(){
	  return res.status(201).send()
  })
    .catch(handleError(res));
}

exports.batchRemoveMycokeyCharacter = function(req, res) {

return models.MycokeyGenusCharacter.destroy(
	{where :{ Character: req.params.id, taxon_id: _.map(req.body, function(e){
	return e._id;
})

}
}
)
.then(function(){
  return res.status(204).send()
})
  .catch(handleError(res));
}



