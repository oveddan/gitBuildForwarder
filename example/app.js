var connect = require('connect'),
  gitBuildForwarder = require('../index');

var config = {
  repositoryType : 'bitBucket',
  buildUrlsForBranches : {
    site : {
      master : "http://jenkins.yourcompany.com/site/master",
      dev : "http://jenkins.yourcompany.com/site/dev"
    },
    library : {
      master : "http://jenkins.yourcompany.com/site/master",
      branchA : "http://jenkins.yourcompany.com/site/branchA"
    }
  }
}

var app = connect()
  .use(connect.bodyParser())
  .use(gitBuildForwarder(config))
  .listen(3000);