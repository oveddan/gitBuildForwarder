var bitBucketPostParser = {
  parseGitPost: function(request, callback){
    var body = request.body;
    if(!body)
      callback(new Error('request body is null - make sure to use connect.bodyParser in middleware'));
    else if(!body.payload)
      callback(new Error('request body.payload is null'));
    else if(!body.payload.commits || !(body.payload.commits instanceof Array))
      callback(new Error('commits are null or not an array'));
    else if(!body.payload || !body.payload.repository || !body.payload.repository.name)
      callback(new Error('payload, repository or repository name are null'));
    else {
      var branches = [],
        payload = body.payload;
      console.log(payload);    for(var i = 0; i < payload.commits.length; i++){
        // add branch if does not exist in array yet
        var branchToAdd = payload.commits[i].branch;
        if(branches.indexOf(branchToAdd) == -1)
          branches.push(branchToAdd);
      }
      var result = {
        repository : payload.repository.name,
        branches : branches
      };
      callback(null, result);
    }
  }
};

exports.bitBucket = bitBucketPostParser;
