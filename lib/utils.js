var gitPostParsers = require('./gitPostParsers'),
  step = require('step');

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

    step(
      function(){
        var group = this.group();
        for(var i = 0; i < repositoriesAndBranches.branches.length; i++){
          var branch = repositoriesAndBranches.branches[i];
          utils.forwardBuild(token, repositoriesAndBranches.repository, branch, group());
        }
      },
      function(err, branchForwardResults){
        callback(err, branchForwardResults);
      }
    );
  },
  forwardBuild : function(token, repository, branch, callback){
    callback(null, {});
  }
};

//var forwardBuildsRecursive = function(token, repositoriesAndBranches, currentIndex, currentOutput, callback){
//
//  //console.log(arguments);
//  if(currentIndex == repositoriesAndBranches.branches.length)
//    callback(null, currentOutput);
//  else {
//    var branch = repositoriesAndBranches.branches[currentIndex];
//    utils.forwardBuild(token, repositoriesAndBranches.repository, branch, function(err, result){
//      currentOutput[branch] = result;
//      forwardBuildsRecursive(token, repositoriesAndBranches, currentIndex + 1, currentOutput, callback);
//    });
//  }
//}

module.exports = utils;