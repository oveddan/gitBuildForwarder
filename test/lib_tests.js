var should = require('chai').should()
  , sinon = require('sinon')
  , utils = require('../lib/utils')
  , gitPostParsers = require('../lib/gitPostParsers');


describe('utils', function(){
  describe('createParserForRepositoryType(repositoryType)', function(){
    it('should return bitBucketPostParser if type is bitBucket', function(){
      var result = utils.createParserForRepositoryType('bitBucket');
      result.should.equal(gitPostParsers.bitBucket);
    });
  });
});

describe('bitBucketPostParser', function(){
  describe('parseGitPost(req, callback)', function(){
    it('should callback with error if req.body is null', function(done){
      gitPostParsers.bitBucket.parseGitPost({body : null}, function(err, result){
        err.should.not.beNull;
        done();
      });
    });
    it('should callback with error if req.body.commits is not an array', function(done){
      gitPostParsers.bitBucket.parseGitPost({body : { commits : {a : '5'} }}, function(err, result){
        err.should.not.beNull;
        done();
      });
    });
    it('should callback with error if repository or repository.name is null', function(done){
      gitPostParsers.bitBucket.parseGitPost({
        body :
          { commits : [],
          repository : {
            name : null
          }}
        },
        function(err, result){
           err.should.not.beNull;
           done();
        });
    });
    it('should callback with repository name and array of branches', function(done){

      // setup
      var validRequest = {
        body : {
          commits : [
            { branch : 'master'},
            { branch : 'staging'},
            { branch : 'production'}
          ],
          repository : {
            name : 'your-company.site'
          }
        }
      };

      var expectedResult = {
        repository : validRequest.body.repository.name,
        branches: ["master", "staging", "production"]
      };

      // test
      gitPostParsers.bitBucket.parseGitPost(validRequest, function(err, result){
        // should
        result.should.eql(expectedResult);
        done();
      });
    });
  });
});