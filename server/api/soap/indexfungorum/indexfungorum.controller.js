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
var soap = require('soap');
var wsdl = "http://www.indexfungorum.org/ixfwebservice/fungus.asmx?WSDL";
var Taxon = require("../../mysql/Taxon/Taxon.controller");

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
	soap.createClient(wsdl, function(err, client) {
		if (err ) throw err;
		
		client.NameSearch(req.query, function(err, result) {
			if (err) {
				res.status(500).json(err.message)
			};
				res.status(200).json(result)
		          console.log(result);
		      });
	});
};

exports.EpithetSearch = function(req, res) {
	soap.createClient(wsdl, function(err, client) {
		if (err ) throw err;
		
		client.EpithetSearch(req.query, function(err, result) {
			if (err) {
				res.status(500).json(err.message)
			};
				res.status(200).json(result)
		          console.log(result);
		      });
	});
};


exports.NameByKey = function(req, res) {
	soap.createClient(wsdl, function(err, client) {
		if (err ) throw err;
		
		client.NameByKey(req.query, function(err, result) {
			if (err) {
				res.status(500).json(err.message)
			};
			var r = result.NameByKeyResult.NewDataSet.IndexFungorum;
			
			if(r !== undefined){
			var systematicPath = Taxon.getSystematicPath(r, r.INFRASPECIFIC_x0020_RANK);
			result.NameByKeyResult.NewDataSet.IndexFungorum.SystematicPath= systematicPath;
		};
				res.status(200).json(result)
		          console.log(result);
		      });
	});
};



// Get list of things
exports.NewNames = function(req, res) {
	soap.createClient(wsdl, function(err, client) {
		if (err ) throw err;
		
		client.NewNames({rank: req.params.rank, startDate: req.params.startdate}, function(err, result) {
			if (err) throw err;
				res.status(200).json(result)
		          console.log(result);
		      });
	});
};

