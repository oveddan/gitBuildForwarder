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
    it('should callback with error if req.body is null', function(){
    });
    it('should callback with error if req.body.commits is null or not an array', function(){

    });
    it('should callback with error if repository or repository.name is null', function(){

    });
    it('should callback with repository name and array of branches', function(){

    });
  });
});