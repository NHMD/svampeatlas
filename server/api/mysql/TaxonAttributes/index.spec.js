'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var taxonAttributesCtrlStub = {
  index: 'taxonAttributesCtrl.index',
  show: 'taxonAttributesCtrl.show',
  create: 'taxonAttributesCtrl.create',
  update: 'taxonAttributesCtrl.update',
  destroy: 'taxonAttributesCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var taxonAttributesIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './taxonAttributes.controller': taxonAttributesCtrlStub
});

describe('TaxonAttributes API Router:', function() {

  it('should return an express router instance', function() {
    taxonAttributesIndex.should.equal(routerStub);
  });

  describe('GET /api/taxonattributes', function() {

    it('should route to taxonAttributes.controller.index', function() {
      routerStub.get
                .withArgs('/', 'taxonAttributesCtrl.index')
                .should.have.been.calledOnce;
    });

  });

  describe('GET /api/taxonattributes/:id', function() {

    it('should route to taxonAttributes.controller.show', function() {
      routerStub.get
                .withArgs('/:id', 'taxonAttributesCtrl.show')
                .should.have.been.calledOnce;
    });

  });

  describe('POST /api/taxonattributes', function() {

    it('should route to taxonAttributes.controller.create', function() {
      routerStub.post
                .withArgs('/', 'taxonAttributesCtrl.create')
                .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/taxonattributes/:id', function() {

    it('should route to taxonAttributes.controller.update', function() {
      routerStub.put
                .withArgs('/:id', 'taxonAttributesCtrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/taxonattributes/:id', function() {

    it('should route to taxonAttributes.controller.update', function() {
      routerStub.patch
                .withArgs('/:id', 'taxonAttributesCtrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/taxonattributes/:id', function() {

    it('should route to taxonAttributes.controller.destroy', function() {
      routerStub.delete
                .withArgs('/:id', 'taxonAttributesCtrl.destroy')
                .should.have.been.calledOnce;
    });

  });

});
