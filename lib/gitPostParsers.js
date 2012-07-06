var bitBucketPostParser = {
  parseGitPost: function(request, callback){
    var body = request.body;
    if(!body)
      callback(new Error('request body is null - make sure to use connect.bodyParser in middleware'));
    else if(!body.payload)
      callback(new Error('request body.payload is null'));
    else {
      var commitInfo = JSON.parse(body.payload);

      if(!commitInfo.commits || !(commitInfo.commits instanceof Array))
        callback(new Error('commits are null or not an array'));
      else if(!commitInfo.repository || !commitInfo.repository.name)
        callback(new Error('repository or repository name are null'));
      else {
        var branches = [];
        for(var i = 0; i < commitInfo.commits.length; i++){
          // add branch if does not exist in array yet
          var branchToAdd = commitInfo.commits[i].branch;
          if(branches.indexOf(branchToAdd) == -1)
            branches.push(branchToAdd);
        }
        var result = {
          repository : commitInfo.repository.name,
          branches : branches
        };
        callback(null, result);
      }
    }
  }
};

exports.bitBucket = bitBucketPostParser;
