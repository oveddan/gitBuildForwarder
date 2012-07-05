var utils = require('./lib/utils')
  , BuildForwarder = require('./lib/BuildForwarder');

var gitBuildForwarder = function(config){
  if(!config)
    throw new Error('config cannot be null');

  var repositoryPostParser = utils.createParserForRepositoryType(config.repositoryType);


  console.log('in parser:');
  console.log(BuildForwarder.prototype.constructor);

  var buildForwarder = new BuildForwarder(config.buildUrlsForBranches);

  console.log('assigned forwarder');
  console.log(buildForwarder);

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