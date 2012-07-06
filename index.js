var utils = require('./lib/utils');

var gitBuildForwarder = function(config, loggingFunction){
  if(!config)
    throw new Error('config cannot be null');

  var repositoryPostParser = utils.createParserForRepositoryType(config.repositoryType),
    buildForwarder = utils.createBuildForwarder(config.buildUrlsForBranches);

  return function(req, res, next){
    if(loggingFunction)
      logRequest(req, loggingFunction);

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
            var resultJson = JSON.stringify(result);
            if(loggingFunction){
              loggingFunction('result of forwarded builds:');
              loggingFunction(resultJson);
            }

            res.end(resultJson);
        });
      }
    });
  };
};

var logRequest = function(request, loggingFunction){
  if(request && request.body && loggingFunction){
    loggingFunction('received request with body:');
    loggingFunction(request.body);
  }
}

var parseToken = function(request){
  if(!request)
    throw new Error('request is null');
  if(!request.query)
    throw new Error("Query has not been parsed.  Please make sure to use the middleware connect.query, " +
      "as specified in http://www.senchalabs.org/connect/query.html");
  return request.query.token;
}

module.exports = gitBuildForwarder;