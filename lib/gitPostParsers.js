var bitBucketPostParser = {
  parseGitPost: function(request, callback){
    var body = request.body;
    if(!body)
      callback(new Error('request body is null - make sure to use connect.bodyParser in middleware'));
    else if(!body.commits || !(body.commits instanceof Array))
      callback(new Error('commits are null or not an array'));
    else if(!body.repository || !body.repository.name)
      callback(new Error('repository or repository name are null'));
    else {
      var branches = [];
      for(var i = 0; i < body.commits.length; i++){
        // add branch if does not exist in array yet
        var branchToAdd = body.commits[i].branch;
        if(branches.indexOf(branchToAdd) == -1)
          branches.push(branchToAdd);
      }
      var result = {
        repository : body.repository.name,
        branches : branches
      };
      callback(null, result);
    }
  }
};

exports.bitBucket = bitBucketPostParser;