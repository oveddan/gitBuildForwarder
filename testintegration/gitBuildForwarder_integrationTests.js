var should = require('chai').should(),
  express = require('express'),
  connect = require('connect'),
  gitBuildForwarder = require('../index'),
  request = require('superagent');

describe('gitBuildForwarder', function(){
  it('should forward build to correct url', function(done){
    // create express app to cimulate CI app that listens on forwarded url
    var fakeCiApp = express.createServer();
    var token = '1231321'

    var masterBranchBuilt = false,
      stagingBranchBuilt = false;

    // app will listen for build on library branch master, and send token back
    fakeCiApp.get('/library/master', function(req, res){
      req.query.token.should.be(token);
      masterBranchBuilt = true;
      res.send(token);
    });
    // app will listen for build on library branch staging, and send token back
    fakeCiApp.get('/library/staging', function(req, res){
      req.query.token.should.be(token);
      stagingBranchBuilt = true;
      res.send(token);
    });

    fakeCiApp.listen(3000);

    // create git build forwarding app
    var config = {
      repositoryType : 'bitBucket',
      buildUrlsForBranches : {
        site : {
          master : "http://localhost:3000/site/master",
          dev : "http://localhost:3000/site/dev"
        },
        "yourCompany.library" : {
          master : "http://localhost:3000/library/master",
          branchA : "http://localhost:3000/library/branchA",
          staging : "http://localhost:3000/library/staging"
        }
      }
    };

    var gitBuildForwarderApp = connect()
      .use(connect.bodyParser())
      .use(gitBuildForwarder(config))
      .listen(3001);

    // post to forwarding app
    var fakeBitBucketPost =
    {
      commits: [
        {
          branch: "master"
        },
        {
          branch: "stagin"
        }
      ],
      "repository": {
        "name": "yourCompany.library"
      },
      "user": "marcus"
    };

    request.post("http://localhost:3001?token=" + token)
      .send(fakeBitBucketPost)
      .end(function(response){
        console.log(response);
        masterBranchBuilt.should.be(true);
        stagingBranchBuilt.should.be(true);
        done();
      });

  });
});