var should = require('chai').should(),
  express = require('express'),
  connect = require('connect'),
  gitBuildForwarder = require('../index'),
  request = require('superagent');

describe('gitBuildForwarder', function(){
  it('should forward build to correct url', function(done){
    // setup
    // create express app to cimulate CI app that listens on forwarded urls
    var fakeCiApp = express.createServer();

    var token = '1231321'

    var masterBranchBuilt = false,
      stagingBranchBuilt = false;

    // app will listen for build on library branch master, and send token back
    fakeCiApp.get('/library/master', function(req, res){
      req.query.token.should.equal(token);
      masterBranchBuilt = true;
      res.end(token);
    });

    // app will listen for build on library branch staging, and send token back
    fakeCiApp.get('/library/staging', function(req, res){
      req.query.token.should.equal(token);
      stagingBranchBuilt = true;
      res.end(token);
    });

    fakeCiApp.listen(3000);

    // create git build forwarding app
    var config = {
      repositoryType : 'bitBucket',
      buildUrlsForBranches : {
        // respository : site
        site : {
          master : "http://localhost:3000/site/master",
          dev : "http://localhost:3000/site/dev"
        },
        // respository : yourCompany.library
        "yourCompany.library" : {
          master : "http://localhost:3000/library/master",
          branchA : "http://localhost:3000/library/branchA",
          staging : "http://localhost:3000/library/staging"
        }
      }
    };

    // create app with gitBuildForwarder connect middleware
    var gitBuildForwarderApp = connect()
      .use(connect.query())
      .use(connect.bodyParser())
      // use middleware, and pass console.log so we can see the output
      .use(gitBuildForwarder(config, console.log))
      .listen(3001);

    // create bitBucket git post to forwarding app
    var fakeBitBucketPost =
    {
      commits: [
        {
          branch: "master"
        },
        {
          branch: "staging"
        }
      ],
      "repository": {
        "name": "yourCompany.library"
      },
      "user": "marcus"
    };

    // test
    request.post("http://localhost:3001?token=" + token)
      .send(fakeBitBucketPost)
      .end(function(response){
        // should
        masterBranchBuilt.should.equal(true);
        stagingBranchBuilt.should.equal(true);
        done();
      });

  });
});