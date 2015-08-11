'use strict';

var app = require('../../app');
var request = require('supertest');

describe('Naturtype API:', function() {

  describe('GET /api/naturetypes', function() {
    var Naturtypes;

    beforeEach(function(done) {
      request(app)
        .get('/api/naturetypes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          Naturtypes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Naturtypes.should.be.instanceOf(Array);
    });

  });

});
