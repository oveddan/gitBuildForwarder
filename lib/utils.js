var gitPostParsers = require('./gitPostParsers'),
  async = require('async');

var utils = {
  createParserForRepositoryType : function(repositoryType){
    var result;
    switch(repositoryType){
      case 'bitBucket' :
        result = gitPostParsers.bitBucket;
        break;
      default:
        throw new Error('Unknown repositoryType of ' + repositoryType + '.');
    }
    return result;
  },
  forwardBuilds : function(token, repositoriesAndBranches, callback){
    async.reduce(repositoriesAndBranches.branches, { branchResults : {}}, function(currentResults, branch, callback){
      utils.forwardBuild(token, repositoriesAndBranches.repository, branch, function(err, branchResult){
        currentResults.branchResults[branch] = branchResult;
        callback(err, currentResults);
      });
    }, function(err, finalResult){
      finalResult.repository = repositoriesAndBranches.repository;
      callback(err, finalResult);
    });
  },
  forwardBuild : function(token, repository, branch, callback){
    callback(null, {});
  }
};

module.exports = utils;