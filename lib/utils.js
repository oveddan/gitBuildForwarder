var gitPostParsers = require('./gitPostParsers');

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
    forwardBuildsRecursive(token, repositoriesAndBranches, 0, {}, function(err, branchResults){
      var finalResult = {
        repository : repositoriesAndBranches.repository,
        branchResults : branchResults
      };
      callback(null, branchResults);
    });
  },
  forwardBuild : function(){

  }
};

var forwardBuildsRecursive = function(token, repositoriesAndBranches, currentIndex, currentOutput, callback){

  console.log(arguments);
  if(currentIndex == repositoriesAndBranches.branches.length)
    callback(null, currentOutput);
  else {
    var branch = repositoriesAndBranches.branches[currentIndex];
    utils.forwardBuild(token, repositoriesAndBranches.repository, branch, function(err, result){
      currentOutput[branch] = result;
      forwardBuildsRecursive(token, repositoriesAndBranches, currentIndex + 1, currentOutput, callback);
    });
  }
}

module.exports = utils;