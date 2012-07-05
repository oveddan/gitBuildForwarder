var gitPostParsers = require('./gitPostParsers')
  BuildForwarder = require('./BuildForwarder');

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
  createBuildForwarder : function(buildUrlsForBranches){
   return new BuildForwarder(buildUrlsForBranches);
  }
};

module.exports = utils;