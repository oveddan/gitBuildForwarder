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

  describe('forwardBuilds(token, repositoryAndBranches, callback)', function(){
    it('should iterate through each repository and branch and forward it', function(){
      // setup
      var originalForwardBuild = utils.forwardBuild;
      utils.forwardBuild = sinon.spy();
      var repositoryAndBranches = {
        repository : "mainRepo",
        branches : ['staging', 'master', 'dev']
      };
      // test
      utils.forwardBuilds('1234', repositoryAndBranches, function(){});

      //console.log(utils.forwardBuild);

      // should
      for(var i = 0; i < repositoryAndBranches.branches.length; i++){
        //console.log(i);
        //console.log(repositoryAndBranches.branches[i]);
        utils.forwardBuild.calledWith('1234', repositoryAndBranches.repository, repositoryAndBranches.branches[i]).should.be.ok;
      }

      // restore
      utils.forwardBuild = originalForwardBuild;
    });
    it('should callback with aggregated list of results from forwarded builds', function(done){
      var originalForwardBuild = utils.forwardBuild;
      utils.forwardBuild = sinon.spy();
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
      utils.forwardBuilds('1234', repositoryAndBranches, callback);

      // get each callback and invoke it with result
      utils.forwardBuild.firstCall.args[3](null, results[0]);
      utils.forwardBuild.secondCall.args[3](null, results[1]);
      utils.forwardBuild.thirdCall.args[3](null, results[2]);


      // restore
      utils.forwardBuild = originalForwardBuild;
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