'use strict';

var app = require('../../app');
var request = require('supertest');

var newTaxonAttributes;

describe('TaxonAttributes API:', function() {

  describe('GET /api/taxonattributes', function() {
    var taxonattributes;

    beforeEach(function(done) {
      request(app)
        .get('/api/taxonattributes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          taxonattributes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      taxonattributes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/taxonattributes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/taxonattributes')
        .send({
          name: 'New TaxonAttributes',
          info: 'This is the brand new taxonattribute!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newTaxonAttributes = res.body;
          done();
        });
    });

    it('should respond with the newly created taxonattribute', function() {
      newTaxonAttributes.name.should.equal('New TaxonAttributes');
      newTaxonAttributes.info.should.equal('This is the brand new taxonattribute!!!');
    });

  });

  describe('GET /api/taxonattributes/:id', function() {
    var taxonattribute;

    beforeEach(function(done) {
      request(app)
        .get('/api/taxonattributes/' + newTaxonAttributes._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          taxonattribute = res.body;
          done();
        });
    });

    afterEach(function() {
      taxonattribute = {};
    });

    it('should respond with the requested taxonattribute', function() {
      taxonattribute.name.should.equal('New TaxonAttributes');
      taxonattribute.info.should.equal('This is the brand new taxonattribute!!!');
    });

  });

  describe('PUT /api/taxonattributes/:id', function() {
    var updatedTaxonAttributes

    beforeEach(function(done) {
      request(app)
        .put('/api/taxonattributes/' + newTaxonAttributes._id)
        .send({
          name: 'Updated TaxonAttributes',
          info: 'This is the updated taxonattribute!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTaxonAttributes = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTaxonAttributes = {};
    });

    it('should respond with the updated taxonattribute', function() {
      updatedTaxonAttributes.name.should.equal('Updated TaxonAttributes');
      updatedTaxonAttributes.info.should.equal('This is the updated taxonattribute!!!');
    });

  });

  describe('DELETE /api/taxonattributes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/taxonattributes/' + newTaxonAttributes._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when taxonattribute does not exist', function(done) {
      request(app)
        .delete('/api/taxonattributes/' + newTaxonAttributes._id)
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
