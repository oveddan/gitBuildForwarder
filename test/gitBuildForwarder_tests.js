var should = require('chai').should()
  , sinon = require('sinon')
  , gitBuildForwarder = require('../index')
  , utils = require('../lib/utils')
  , BuildForwarder = require('../lib/BuildForwarder');


describe('gitBuildForwarder(config)', function(){
  it('should return a function', function(){
    var result = gitBuildForwarder({repositoryType : 'bitBucket'});
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
        write : sinon.spy(),
        writeHead : sinon.spy(),
        end : sinon.spy()
      };

      this.originalCreateParser = utils.createParserForRepositoryType;
      utils.createParserForRepositoryType = sinon.stub().withArgs('bitBucket').returns(this.parser);

      this.BuildForwarder = {
        forwardBuilds : sinon.spy()
      };

      this.originalCreateBuildForwarder = utils.createBuildForwarder;

      utils.createBuildForwarder = sinon.stub().returns(this.BuildForwarder);

      this.middlewareFunction = gitBuildForwarder(this.options);
    });
    afterEach(function(){
      utils.createParserForRepositoryType = this.originalCreateParser;

      utils.createBuildForwarder = this.originalCreateBuildForwarder;
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

      // test
      // invoke parseGitPost callback function with error
      this.parser.parseGitPost.firstCall.args[1](expectedError);
    });
    it('should forward builds with token, repositories, and branches', function(){
      // setup
      this.middlewareFunction(this.request, this.response, function(){});

      var expectedRepositoriesAndBranches = {
        repository : "mainRepo",
        branches: ["master", "staging"]
      };
      // test by invoking callback from parse git post
      this.parser.parseGitPost.firstCall.args[1](null, expectedRepositoriesAndBranches);

      // should
      this.BuildForwarder.forwardBuilds.calledWith(this.request.query.token, expectedRepositoriesAndBranches).should.be.ok;
    });
    it('should callback with json from forwarded builds', function(){
      // setup
      this.middlewareFunction(this.request, this.response, function(){});

      // invoke parseGitPost callback with data that is not relevant for this test
      this.parser.parseGitPost.firstCall.args[1](null, {});

      // get callback from forwardBuilds and invoke with some dummy result
      var dummyResult = { a: "b"};
      var callback = this.BuildForwarder.forwardBuilds.firstCall.args[2];
      // test
      callback(null, dummyResult);
      // should
      this.response.end.calledOnce.should.be.ok;
      this.response.end.firstCall.args[0].should.eql(JSON.stringify(dummyResult));
    });
  });
});