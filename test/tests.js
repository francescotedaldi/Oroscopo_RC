var should = require('chai').should();
var assert = require('chai').assert
var https = require('https');
const axios = require('axios');

const agent = new https.Agent({  
    rejectUnauthorized: false
  });

  describe("Test nginx is proxing in http", function() {
    it("should return 200", function(done) {
        axios.get('http://localhost:80/', {httpsAgent: agent}).then(function(response) {
	       response.status.should.equal(200);
		   done();
	}).catch(function(error) {
		   done(error);
	});
  });
});

describe("Test nginx is proxing in https", function() {
    it("should return 200", function(done) {
        axios.get('https://localhost:443/', {httpsAgent: agent}).then(function(response) {
	       response.status.should.equal(200);
		   done();
	}).catch(function(error) {
		   done(error);
	});
  });
});

describe("Test if the dashboard is reachable", function() {
    it("should return 200", function(done) {
        axios.get('https://localhost:443/dashboard', {httpsAgent: agent}).then(function(response) {
	       response.status.should.equal(200);
		   done();
	}).catch(function(error) {
		   done(error);
	});
  });
});




