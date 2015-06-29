'use strict';

var app = require('../../../app');
var request = require('supertest');

describe('TaxonLog API:', function() {

  describe('GET /api/taxonlogs', function() {
    var TaxonLogs;

    beforeEach(function(done) {
      request(app)
        .get('/api/taxonlogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          TaxonLogs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      TaxonLogs.should.be.instanceOf(Array);
    });

  });

});
