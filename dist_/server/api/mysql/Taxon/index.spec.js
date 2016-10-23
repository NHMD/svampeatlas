'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var taxonCtrlStub = {
  index: 'taxonCtrl.index',
  show: 'taxonCtrl.show',
  create: 'taxonCtrl.create',
  update: 'taxonCtrl.update',
  destroy: 'taxonCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var taxonIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './taxon.controller': taxonCtrlStub
});

describe('Taxon API Router:', function() {

  it('should return an express router instance', function() {
    taxonIndex.should.equal(routerStub);
  });

  describe('GET /api/taxons', function() {

    it('should route to taxon.controller.index', function() {
      routerStub.get
                .withArgs('/', 'taxonCtrl.index')
                .should.have.been.calledOnce;
    });

  });

  describe('GET /api/taxons/:id', function() {

    it('should route to taxon.controller.show', function() {
      routerStub.get
                .withArgs('/:id', 'taxonCtrl.show')
                .should.have.been.calledOnce;
    });

  });

  describe('POST /api/taxons', function() {

    it('should route to taxon.controller.create', function() {
      routerStub.post
                .withArgs('/', 'taxonCtrl.create')
                .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/taxons/:id', function() {

    it('should route to taxon.controller.update', function() {
      routerStub.put
                .withArgs('/:id', 'taxonCtrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/taxons/:id', function() {

    it('should route to taxon.controller.update', function() {
      routerStub.patch
                .withArgs('/:id', 'taxonCtrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/taxons/:id', function() {

    it('should route to taxon.controller.destroy', function() {
      routerStub.delete
                .withArgs('/:id', 'taxonCtrl.destroy')
                .should.have.been.calledOnce;
    });

  });

});
