var async = require('async'),
    request = require('superagent');

var BuildForwarder = function(buildUrlsForBranches){
  this.buildUrlsForBranches = buildUrlsForBranches;
};

BuildForwarder.prototype.forwardBuilds = function(token, repositoryAndBranchesToForward, callback){
  var self = this;
  // this iterates through all branches and invokes build for them, and creates an aggregated result
  // with results for each branch
  async.reduce(repositoryAndBranchesToForward.branches, { branchResults : {}}, function(currentResults, branch, callback){
    self.forwardBuild(token, repositoryAndBranchesToForward.repository, branch, function(err, branchResult){
      currentResults.branchResults[branch] = branchResult;
      callback(err, currentResults);
    });
  }, function(err, finalResult){
    finalResult.repository = repositoryAndBranchesToForward.repository;
    callback(err, finalResult);
  });
};

BuildForwarder.prototype.forwardBuild = function(token, repository, branch, callback){
  var buildUrlForBranch = findBuildUrlForBranch(repository, branch, this.buildUrlsForBranches);
  if(!buildUrlForBranch)
    callback(null, 'No build configured for repository and branch');
  else {
    BuildForwarder.callBuildUrl(buildUrlForBranch, token, function(err, response){
      if(err)
        callback(err);
      else{
         callback(null, { 'forwarded with response' : response.body });
      }
    });
  }
};

BuildForwarder.callBuildUrl = function(url, token, callback){
  var requestToSend = request.get(url);
  if(token && token != ''){
    requestToSend.send({token : token});
  };

  requestToSend.end(function(res){
    callback(null, res);
  });
};

var findBuildUrlForBranch = function(repository, branch, buildUrlsForBranches) {
  var repositoryBuildUrls = buildUrlsForBranches[repository];
  if(!repositoryBuildUrls)
    return null;
  else {
    return repositoryBuildUrls[branch];
  }
};

module.exports = BuildForwarder;