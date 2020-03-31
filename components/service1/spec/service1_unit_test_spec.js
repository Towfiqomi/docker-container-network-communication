/*  eslint linebreak-style: ["error", "windows"]  */
/* eslint-env es6 */
/*  eslint max-len: ["error", { "code": 280 }]*/


const request = require('request');
const application = require('../src/index.js');
// eslint-disable-next-line camelcase
const base_url = 'http://localhost:8001/';

describe('Service 1 Application Server', function() {
  describe('GET /', function() {
    it('returns status code 200', function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it('returns Hello', function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toBe('Hello From Service One');
        application.closeServer();
        done();
      });
    });
  });
});

