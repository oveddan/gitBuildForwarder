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
    this.config = {

    };
  });
  it("should callback with 'No build for branch' if forwarded url cannot be found", function(){

  });
  it('should invoke a request on forwarded url with token if can be found', function(){

  });
  it("should callback with 'forwarded' and response if can be found", function(){

  });
});