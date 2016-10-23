'use strict';

var app = require('../../app');
var request = require('supertest');

var newTaxon;

describe('Taxon API:', function() {

  describe('GET /api/taxons', function() {
    var taxons;

    beforeEach(function(done) {
      request(app)
        .get('/api/taxons')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          taxons = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      taxons.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/taxons', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/taxons')
        .send({
          name: 'New Taxon',
          info: 'This is the brand new taxon!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newTaxon = res.body;
          done();
        });
    });

    it('should respond with the newly created taxon', function() {
      newTaxon.name.should.equal('New Taxon');
      newTaxon.info.should.equal('This is the brand new taxon!!!');
    });

  });

  describe('GET /api/taxons/:id', function() {
    var taxon;

    beforeEach(function(done) {
      request(app)
        .get('/api/taxons/' + newTaxon._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          taxon = res.body;
          done();
        });
    });

    afterEach(function() {
      taxon = {};
    });

    it('should respond with the requested taxon', function() {
      taxon.name.should.equal('New Taxon');
      taxon.info.should.equal('This is the brand new taxon!!!');
    });

  });

  describe('PUT /api/taxons/:id', function() {
    var updatedTaxon

    beforeEach(function(done) {
      request(app)
        .put('/api/taxons/' + newTaxon._id)
        .send({
          name: 'Updated Taxon',
          info: 'This is the updated taxon!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTaxon = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTaxon = {};
    });

    it('should respond with the updated taxon', function() {
      updatedTaxon.name.should.equal('Updated Taxon');
      updatedTaxon.info.should.equal('This is the updated taxon!!!');
    });

  });

  describe('DELETE /api/taxons/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/taxons/' + newTaxon._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when taxon does not exist', function(done) {
      request(app)
        .delete('/api/taxons/' + newTaxon._id)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
