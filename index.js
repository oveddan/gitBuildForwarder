var utils = require('./lib/utils');

var gitBuildForwarder = function(config){
  if(!config)
    throw new Error('config cannot be null');

  var repositoryPostParser = utils.createParserForRepositoryType(config.repositoryType);

  return function(){
  };
};

module.exports = gitBuildForwarder;