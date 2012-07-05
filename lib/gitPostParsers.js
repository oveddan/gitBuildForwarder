var bitBucketPostParser = {
  parseGitPost: function(request, callback){
    var body = request.body;
    if(!body)
      callback(new Error('request body is null'));
    else if(!body.commits || !(body.commits instanceof Array))
      callback(new Error('commits are null or not an array'));
    else if(!body.repository || !body.repository.name)
      callback(new Error('repository or repository name are null'));
    else {
      var branches = [];
      for(var i = 0; i < body.commits.length; i++){
        branches.push(body.commits[i].branch);
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