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
      var payloadBody = {
        commits : [],
        repository : {
          name : null
        }
      };

      gitPostParsers.bitBucket.parseGitPost({
        body : {
            payload : JSON.stringify(payloadBody)
          }
        },
        function(err, result){
           err.should.not.beNull;
           done();
        });
    });
    it('should callback with repository name and array of branches', function(done){
      var payloadBody = {
        commits : [
          { branch : 'master'},
          { branch : 'staging'},
          { branch : 'production'}
        ],
        repository : {
          name : 'your-company.site'
        }
      };

      // setup
      var validRequest = {
        body : {
          payload : JSON.stringify(payloadBody)
        }
      };

      var expectedResult = {
        repository : payloadBody.repository.name,
        branches: ["master", "staging", "production"]
      };

      // test
      gitPostParsers.bitBucket.parseGitPost(validRequest, function(err, result){
        // should
        result.should.eql(expectedResult);
        done();
      });
    });
    it('should callback with branch names as a set, with a branch name appearing at most one time, ' +
      'even if more than one commit is posted for a branch', function(done){
      var payloadBody = {
        commits : [
          { id : '1231231321',
            branch : 'dev'},
          { branch : 'staging'},
          // create another commit in the dev branch
          { id : '12312333333',
            branch : 'dev'},
          { branch : 'production'},
          // create another commit in the production branch
          { branch : 'production'}
        ],
          repository : {
          name : 'your-company.site'
        }
      };
      // setup - create a request with multiple commits per branch
      var validRequest = {
        body : {
          payload : JSON.stringify(payloadBody)
        }
      };

      var expectedResult = {
        repository : payloadBody.repository.name,
        branches: ["dev", "staging", "production"]
      };

      // test
      gitPostParsers.bitBucket.parseGitPost(validRequest, function(err, result){
        // should
        result.should.eql(expectedResult);
        done();
      });
    })
  });
});