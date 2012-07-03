describe('gitBuildForwarder(config)', function(){
  it('should return a function', function(){

  });
  it('should require a config argument', function(){

  });
  it('should create and contain parser based on configured repository source', function(){

  });

  describe('createParserForRepositoryType(repositoryType)', function(){
    it('should return bitBucketPostParser if type is bitbucket', function(){

    });
    it('should throw error for unknown repository type', function(){

    });
  });

  describe('returned function - parseAndForwardBuild(req, res, next)', function(){
    it('should callback with error if contained parser calls back with error', function(done){

    });
    it('should forward builds token for repositories and branches', function(){

    });
    it('should callback with json from forwarded builds', function(done){

    });
  });

  describe('forwardBuilds(token, repositoryAndBranches, callback)', function(){
    it('should iterate through each repository and branch and forward it', function(){

    });
    it('should callback with aggregated list of results from forwarded builds', function(done){

    });
  });

  describe('forwardBuild(token, repositoryAndBranch, callback)', function(){
    it("should callback with 'No build for branch' if forwarded url cannot be found", function(done){

    });
    it('should invoke a request on forwarded url with token if can be found', function(done){

    });
    it("should callback with 'forwarded' and response if can be found", function(done){

    });
  });
});

describe('bitBucketPostParser', function(){
  describe('parseGitPost(req, callback)', function(){
    it('should callback with error if req.body is null', function(done){

    });
    it('should callback with error if req.body.commits is null or not an array', function(done){

    });
    it('should callback with error if repository or repository.name is null', function(done){

    });
    it('should callback with repository name and array of branches', function(done){

    });
  });
});