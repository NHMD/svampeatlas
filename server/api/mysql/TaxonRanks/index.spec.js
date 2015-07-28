'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var TaxonRanksCtrlStub = {
  index: 'TaxonRanksCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var TaxonRanksIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './TaxonRanks.controller': TaxonRanksCtrlStub
});

describe('TaxonRanks API Router:', function() {

  it('should return an express router instance', function() {
    TaxonRanksIndex.should.equal(routerStub);
  });

  describe('GET /api/taxonranks', function() {

    it('should route to TaxonRanks.controller.index', function() {
      routerStub.get
                .withArgs('/', 'TaxonRanksCtrl.index')
                .should.have.been.calledOnce;
    });

  });

});
