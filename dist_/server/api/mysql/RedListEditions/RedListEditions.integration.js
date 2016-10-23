'use strict';

var app = require('../../app');
var request = require('supertest');

var newRedListEditions;

describe('RedListEditions API:', function() {

  describe('GET /api/redlisteditions', function() {
    var things;

    beforeEach(function(done) {
      request(app)
        .get('/api/redlisteditions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          things = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      things.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/redlisteditions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/redlisteditions')
        .send({
          name: 'New RedListEditions',
          info: 'This is the brand new thing!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newRedListEditions = res.body;
          done();
        });
    });

    it('should respond with the newly created thing', function() {
      newRedListEditions.name.should.equal('New RedListEditions');
      newRedListEditions.info.should.equal('This is the brand new thing!!!');
    });

  });

  describe('GET /api/redlisteditions/:id', function() {
    var thing;

    beforeEach(function(done) {
      request(app)
        .get('/api/redlisteditions/' + newRedListEditions._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          thing = res.body;
          done();
        });
    });

    afterEach(function() {
      thing = {};
    });

    it('should respond with the requested thing', function() {
      thing.name.should.equal('New RedListEditions');
      thing.info.should.equal('This is the brand new thing!!!');
    });

  });

  describe('PUT /api/redlisteditions/:id', function() {
    var updatedRedListEditions

    beforeEach(function(done) {
      request(app)
        .put('/api/redlisteditions/' + newRedListEditions._id)
        .send({
          name: 'Updated RedListEditions',
          info: 'This is the updated thing!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedRedListEditions = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRedListEditions = {};
    });

    it('should respond with the updated thing', function() {
      updatedRedListEditions.name.should.equal('Updated RedListEditions');
      updatedRedListEditions.info.should.equal('This is the updated thing!!!');
    });

  });

  describe('DELETE /api/redlisteditions/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/redlisteditions/' + newRedListEditions._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when thing does not exist', function(done) {
      request(app)
        .delete('/api/redlisteditions/' + newRedListEditions._id)
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
