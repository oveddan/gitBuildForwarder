var should = require('chai').should()
  , sinon = require('sinon')
  , BuildForwarder = require('../lib/BuildForwarder');

describe('forwardBuilds(token, repositoryAndBranches, callback)', function(){
  beforeEach(function(){
    this.BuildForwarder = new BuildForwarder();
  });
  it('should iterate through each repository and branch and forward it', function(){
    // setup
    this.BuildForwarder.forwardBuild = sinon.spy();
    var repositoryAndBranches = {
      repository : "mainRepo",
      branches : ['staging', 'master', 'dev']
    };
    // test
    this.BuildForwarder.forwardBuilds('1234', repositoryAndBranches, function(){});

    // get each callback and invoke it
    this.BuildForwarder.forwardBuild.firstCall.args[3](null, {});
    this.BuildForwarder.forwardBuild.secondCall.args[3](null, {});
    this.BuildForwarder.forwardBuild.thirdCall.args[3](null, {});

    // should
    for(var i = 0; i < repositoryAndBranches.branches.length; i++){
      this.BuildForwarder.forwardBuild.calledWith('1234', repositoryAndBranches.repository, repositoryAndBranches.branches[i]).should.be.ok;
    }

  });
  it('should callback with aggregated list of results from forwarded builds', function(done){
    this.BuildForwarder.forwardBuild = sinon.spy();
    var repositoryAndBranches = {
      repository : "mainRepo",
      branches : ['staging', 'master', 'dev']
    };
    var results = ['this found something', 'could not find build', 'successfully invoked build'];

    var expectedCalledBackData = {
      repository : repositoryAndBranches.repository,
      branchResults : {
        staging : results[0],
        master : results[1],
        dev : results[2]
      }
    };

    var callback = function(err, data){
      data.should.eql(expectedCalledBackData);
      done();
    };

    // test
    this.BuildForwarder.forwardBuilds('1234', repositoryAndBranches, callback);

    // get each callback and invoke it with result
    this.BuildForwarder.forwardBuild.firstCall.args[3](null, results[0]);
    this.BuildForwarder.forwardBuild.secondCall.args[3](null, results[1]);
    this.BuildForwarder.forwardBuild.thirdCall.args[3](null, results[2]);

  });
});

describe('forwardBuild(token, repositoryAndBranch, callback)', function(){
  beforeEach(function(){
    this.buildUrlsForBranches = {
      site : {
        master : 'http://jenkins.fun.com/site/master/build',
        dev : 'http://www.jenkins.com/site/dev/build',
        staging : 'http://jenkins.you.me/site/stagin/build'
      },
      library : {
        master : 'http://jenkins.fun.com/library/master/build',
        staging : 'http://jenkins.you.me/library/stagin/build'
      }
    };
    this.buildForwarder = new BuildForwarder(this.buildUrlsForBranches);

    this.originalcallBuildUrl = BuildForwarder.callBuildUrl;
    BuildForwarder.callBuildUrl = sinon.spy();
  });
  afterEach(function(){
    BuildForwarder.callBuildUrl = this.originalcallBuildUrl;
  });
  it("should callback with 'No build configured for repository and branch' if repository not configured", function(done){
    // test with valid repo but bad branch
    this.buildForwarder.forwardBuild('1234444', 'site', 'production', function(err, result){
      result.should.equal('No build configured for repository and branch');
      done();
    });
  });
  it("should callback with 'No build configured for repository and branch' if branch not configured", function(done){
    // test with invalid repo
    this.buildForwarder.forwardBuild('1234444', 'site97', 'master', function(err, result){
      result.should.equal('No build configured for repository and branch');
      done();
    });
  });
  it('should invoke a request on forwarded url with token if can be found', function(){
    // test
    this.buildForwarder.forwardBuild('4422', 'library', 'master', function(){});

    // should
    var buildUrlForBranch = this.buildUrlsForBranches.library.master;
    BuildForwarder.callBuildUrl.calledWith(buildUrlForBranch, '4422').should.be.ok;
  });
  it("should callback with 'forwarded' and response if can be found", function(done){
    var expectedResponse = { body : 'thanks for building!!!!!! :)'};
    var callback = function(err, branchResult){
      branchResult.should.equal('forwarded with response : ' + expectedResponse.body);
      // should
      done();
    };

    // setup
    this.buildForwarder.forwardBuild('4422', 'library', 'master', callback);
    // get callback from callBuildUrl and invoke it

    var callBuildCallback = BuildForwarder.callBuildUrl.firstCall.args[2];
    callBuildCallback.should.be.a('function');
    // test
    callBuildCallback(null, expectedResponse);
  });
});