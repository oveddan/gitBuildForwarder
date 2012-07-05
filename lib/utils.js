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
  }
};

module.exports = utils;