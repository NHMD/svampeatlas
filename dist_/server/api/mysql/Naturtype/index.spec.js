'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var TaxonImagesCtrlStub = {
  index: 'TaxonImagesCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var TaxonImagesIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './TaxonImages.controller': TaxonImagesCtrlStub
});

describe('TaxonImages API Router:', function() {

  it('should return an express router instance', function() {
    TaxonImagesIndex.should.equal(routerStub);
  });

  describe('GET /api/taxonimages', function() {

    it('should route to TaxonImages.controller.index', function() {
      routerStub.get
                .withArgs('/', 'TaxonImagesCtrl.index')
                .should.have.been.calledOnce;
    });

  });

});
