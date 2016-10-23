'use strict';

var app = require('../../app');
var request = require('supertest');

var newDetermination;

describe('Determination API:', function() {

  describe('GET /api/determinations', function() {
    var determinations;

    beforeEach(function(done) {
      request(app)
        .get('/api/determinations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          determinations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      determinations.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/determinations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/determinations')
        .send({
          name: 'New Determination',
          info: 'This is the brand new determination!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newDetermination = res.body;
          done();
        });
    });

    it('should respond with the newly created determination', function() {
      newDetermination.name.should.equal('New Determination');
      newDetermination.info.should.equal('This is the brand new determination!!!');
    });

  });

  describe('GET /api/determinations/:id', function() {
    var determination;

    beforeEach(function(done) {
      request(app)
        .get('/api/determinations/' + newDetermination._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          determination = res.body;
          done();
        });
    });

    afterEach(function() {
      determination = {};
    });

    it('should respond with the requested determination', function() {
      determination.name.should.equal('New Determination');
      determination.info.should.equal('This is the brand new determination!!!');
    });

  });

  describe('PUT /api/determinations/:id', function() {
    var updatedDetermination

    beforeEach(function(done) {
      request(app)
        .put('/api/determinations/' + newDetermination._id)
        .send({
          name: 'Updated Determination',
          info: 'This is the updated determination!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDetermination = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDetermination = {};
    });

    it('should respond with the updated determination', function() {
      updatedDetermination.name.should.equal('Updated Determination');
      updatedDetermination.info.should.equal('This is the updated determination!!!');
    });

  });

  describe('DELETE /api/determinations/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/determinations/' + newDetermination._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when determination does not exist', function(done) {
      request(app)
        .delete('/api/determinations/' + newDetermination._id)
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
