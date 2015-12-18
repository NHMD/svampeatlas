'use strict';

var app = require('../../app');
var request = require('supertest');

var newObservation;

describe('Observation API:', function() {

  describe('GET /api/observations', function() {
    var observations;

    beforeEach(function(done) {
      request(app)
        .get('/api/observations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          observations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      observations.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/observations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/observations')
        .send({
          name: 'New Observation',
          info: 'This is the brand new observation!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newObservation = res.body;
          done();
        });
    });

    it('should respond with the newly created observation', function() {
      newObservation.name.should.equal('New Observation');
      newObservation.info.should.equal('This is the brand new observation!!!');
    });

  });

  describe('GET /api/observations/:id', function() {
    var observation;

    beforeEach(function(done) {
      request(app)
        .get('/api/observations/' + newObservation._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          observation = res.body;
          done();
        });
    });

    afterEach(function() {
      observation = {};
    });

    it('should respond with the requested observation', function() {
      observation.name.should.equal('New Observation');
      observation.info.should.equal('This is the brand new observation!!!');
    });

  });

  describe('PUT /api/observations/:id', function() {
    var updatedObservation

    beforeEach(function(done) {
      request(app)
        .put('/api/observations/' + newObservation._id)
        .send({
          name: 'Updated Observation',
          info: 'This is the updated observation!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedObservation = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedObservation = {};
    });

    it('should respond with the updated observation', function() {
      updatedObservation.name.should.equal('Updated Observation');
      updatedObservation.info.should.equal('This is the updated observation!!!');
    });

  });

  describe('DELETE /api/observations/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/observations/' + newObservation._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when observation does not exist', function(done) {
      request(app)
        .delete('/api/observations/' + newObservation._id)
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
