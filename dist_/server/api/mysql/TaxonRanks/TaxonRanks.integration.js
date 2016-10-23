'use strict';

var app = require('../../app');
var request = require('supertest');

describe('TaxonRanks API:', function() {

  describe('GET /api/TaxonRanks', function() {
    var TaxonRankss;

    beforeEach(function(done) {
      request(app)
        .get('/api/TaxonRanks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          TaxonRankss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      TaxonRankss.should.be.instanceOf(Array);
    });

  });

});
