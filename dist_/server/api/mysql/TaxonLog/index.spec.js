'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var TaxonLogCtrlStub = {
  index: 'TaxonLogCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var TaxonLogIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './TaxonLog.controller': TaxonLogCtrlStub
});

describe('TaxonLog API Router:', function() {

  it('should return an express router instance', function() {
    TaxonLogIndex.should.equal(routerStub);
  });

  describe('GET /api/taxonlogs', function() {

    it('should route to TaxonLog.controller.index', function() {
      routerStub.get
                .withArgs('/', 'TaxonLogCtrl.index')
                .should.have.been.calledOnce;
    });

  });

});
