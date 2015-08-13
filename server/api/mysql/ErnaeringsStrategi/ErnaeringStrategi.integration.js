'use strict';

var app = require('../../app');
var request = require('supertest');

describe('ErnaeringStrategi API:', function() {

  describe('GET /api/nutritionstrategies', function() {
    var ErnaeringStrategis;

    beforeEach(function(done) {
      request(app)
        .get('/api/nutritionstrategies')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          ErnaeringStrategis = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ErnaeringStrategis.should.be.instanceOf(Array);
    });

  });

});
