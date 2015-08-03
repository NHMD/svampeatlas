'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var TaxonRedListDataCtrlStub = {
  index: 'TaxonRedListDataCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var TaxonRedListDataIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './TaxonRedListData.controller': TaxonRedListDataCtrlStub
});

describe('TaxonRedListData API Router:', function() {

  it('should return an express router instance', function() {
    TaxonRedListDataIndex.should.equal(routerStub);
  });

  describe('GET /api/taxonredlistdata', function() {

    it('should route to TaxonRedListData.controller.index', function() {
      routerStub.get
                .withArgs('/', 'TaxonRedListDataCtrl.index')
                .should.have.been.calledOnce;
    });

  });

});
