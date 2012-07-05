var utils = require('./lib/utils');

var gitBuildForwarder = function(config){
  if(!config)
    throw new Error('config cannot be null');

  var repositoryPostParser = utils.createParserForRepositoryType(config.repositoryType),
    buildForwarder = utils.createBuildForwarder(config.buildUrlsForBranches);

  return function(req, res, next){
    repositoryPostParser.parseGitPost(req, function(err, repositoryAndBranchesToForward){
      if(err)
        next(err);
      else {
        buildForwarder.forwardBuilds(req.query.token, repositoryAndBranchesToForward, function(err, result){
          if(err)
            next(err);
          else
            res.json(result);
        });
      }
    });
  };
};

module.exports = gitBuildForwarder;