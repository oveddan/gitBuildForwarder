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
        var token = parseToken(req);
        buildForwarder.forwardBuilds(token, repositoryAndBranchesToForward, function(err, result){
          if(err)
            next(err);
          else
            res.writeHead(200, {
              'Content-Type' : 'text/json'
            });
            res.write(result.toString());
            res.end();
        });
      }
    });
  };
};

var parseToken = function(request){
  if(!request)
    throw new Error('request is null');
  if(!request.query)
    throw new Error("Query has not been parsed.  Please make sure to use the middleware connect.query, " +
      "as specified in http://www.senchalabs.org/connect/query.html");
  return request.query.token;
}

module.exports = gitBuildForwarder;