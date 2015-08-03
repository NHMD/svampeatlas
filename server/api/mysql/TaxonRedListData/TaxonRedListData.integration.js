'use strict';

var app = require('../../app');
var request = require('supertest');

describe('TaxonRedListData API:', function() {

  describe('GET /api/taxonredlistdata', function() {
    var TaxonRedListDatas;

    beforeEach(function(done) {
      request(app)
        .get('/api/taxonredlistdata')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          TaxonRedListDatas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      TaxonRedListDatas.should.be.instanceOf(Array);
    });

  });

});
