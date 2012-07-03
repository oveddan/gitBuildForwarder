var should = require('chai').should()
  , sinon = require('sinon')
  , gitBuildForwarder = require('../index')
  , utils = require('../lib/utils');


describe('gitBuildForwarder(config)', function(){
  it('should return a function', function(){
    var result = gitBuildForwarder({});
    result.should.be.a('function');
  });
  it('should require a config argument', function(){
    (function(){
      var result = gitBuildForwarder(null);
    }).should.throw('config cannot be null');
  });
  it('should create and contain parser based on configured repository repositoryType', function(){
    // setup
    var originalMethod = utils.createParserForRepositoryType;
    var expectedParser = { a: "5"};
    utils.createParserForRepositoryType = sinon.spy();
    // test
    var result = gitBuildForwarder({repositoryType : 'bitBucket'});

    // should
    utils.createParserForRepositoryType.calledWith('bitBucket').should.be.ok;
    // restore
    utils.createParserForRepositoryType = originalMethod;
  });

  describe('returned function - parseAndForwardBuild(req, res, next)', function(){
    beforeEach(function(){
      this.options = {repositoryType : 'bitBucket'};
      this.parser = {
        parseGitPost : sinon.spy()
      };
      this.request = {
        query : {
          token : '1234'
        }
      };
      this.response = {
        json : sinon.stub
      };

      this.originalCreateParser = utils.createParserForRepositoryType;
      utils.createParserForRepositoryType = sinon.stub().withArgs('bitBucket').returns(this.parser);

      this.middlewareFunction = gitBuildForwarder(this.options);
    });
    afterEach(function(){
      utils.createParserForRepositoryType = this.originalCreateParser;
    });
    it('should callback with error if contained parser calls back with error', function(done){
      var expectedError = new Error("hey");

      // SHOULD: test that called back with error
      var next = function(err){
        err.should.equal(expectedError);
        done();
      };

      this.middlewareFunction(this.request, {}, next);

      // sanity check that parseGitPost was called with request
      this.parser.parseGitPost.calledWith(this.request).should.be.ok;

      // invoke parseGitPost callback function with error
      this.parser.parseGitPost.firstCall.args[1](expectedError);
    });
    it('should forward builds token for repositories and branches', function(){
      // setup
      this.middlewareFunction(this.request, this.response, function(){});

      var originalforwardBuilds = utils.forwardBuilds;
      utils.forwardBuilds = sinon.spy();
      var expectedRepositoriesAndBranches = {
        repository : "mainRepo",
        branches: ["master", "staging"]
      };
      // test by invoking callback from parse git post
      this.parser.parseGitPost.firstCall.args[1](null, expectedRepositoriesAndBranches);

      utils.forwardBuilds.calledWith(this.request.query.token, expectedRepositoriesAndBranches).should.be.ok;
      // restore
      utils.forwardBuilds = originalforwardBuilds;
    });
    it('should callback with json from forwarded builds', function(){
    });
  });

  describe('forwardBuilds(token, repositoryAndBranches, callback)', function(){
    it('should iterate through each repository and branch and forward it', function(){
    });
    it('should callback with aggregated list of results from forwarded builds', function(){
    });
  });

  describe('forwardBuild(token, repositoryAndBranch, callback)', function(){
    it("should callback with 'No build for branch' if forwarded url cannot be found", function(){

    });
    it('should invoke a request on forwarded url with token if can be found', function(){

    });
    it("should callback with 'forwarded' and response if can be found", function(){

    });
  });
});

describe('utils', function(){
  describe('createParserForRepositoryType(repositoryType)', function(){
    it('should return bitBucketPostParser if type is bitbucket', function(){
    });
    it('should throw error for unknown repository type', function(){
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