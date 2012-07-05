var async = require('async');

var BuildForwarder = function(buildUrlsForBranches){
  this.buildUrlsForBranches;
};

BuildForwarder.prototype.forwardBuilds = function(token, repositoryAndBranchesToForward, callback){
  var self = this;
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
  callback(null, {});
};

module.exports = BuildForwarder;