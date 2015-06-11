'use strict';

var app = require('../../app');
var request = require('supertest');

describe('TaxonImages API:', function() {

  describe('GET /api/taxonimages', function() {
    var TaxonImagess;

    beforeEach(function(done) {
      request(app)
        .get('/api/taxonimages')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          TaxonImagess = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      TaxonImagess.should.be.instanceOf(Array);
    });

  });

});
