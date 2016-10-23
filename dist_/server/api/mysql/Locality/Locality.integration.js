'use strict';

var app = require('../../app');
var request = require('supertest');

var newLocality;

describe('Locality API:', function() {

  describe('GET /api/localitys', function() {
    var localitys;

    beforeEach(function(done) {
      request(app)
        .get('/api/localitys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          localitys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      localitys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/localitys', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/localitys')
        .send({
          name: 'New Locality',
          info: 'This is the brand new locality!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newLocality = res.body;
          done();
        });
    });

    it('should respond with the newly created locality', function() {
      newLocality.name.should.equal('New Locality');
      newLocality.info.should.equal('This is the brand new locality!!!');
    });

  });

  describe('GET /api/localitys/:id', function() {
    var locality;

    beforeEach(function(done) {
      request(app)
        .get('/api/localitys/' + newLocality._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          locality = res.body;
          done();
        });
    });

    afterEach(function() {
      locality = {};
    });

    it('should respond with the requested locality', function() {
      locality.name.should.equal('New Locality');
      locality.info.should.equal('This is the brand new locality!!!');
    });

  });

  describe('PUT /api/localitys/:id', function() {
    var updatedLocality

    beforeEach(function(done) {
      request(app)
        .put('/api/localitys/' + newLocality._id)
        .send({
          name: 'Updated Locality',
          info: 'This is the updated locality!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedLocality = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLocality = {};
    });

    it('should respond with the updated locality', function() {
      updatedLocality.name.should.equal('Updated Locality');
      updatedLocality.info.should.equal('This is the updated locality!!!');
    });

  });

  describe('DELETE /api/localitys/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/localitys/' + newLocality._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when locality does not exist', function(done) {
      request(app)
        .delete('/api/localitys/' + newLocality._id)
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
