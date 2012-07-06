buildgitbranch
==============

Enables builds to be forwarded to a build server based on the branch that was committed to.

Currently with github and bitbucket, there is no way to trigger a post-receive hook when a specific branch is committed to - all that can happen is a web url or build server is hit when the entire repository is committed to, irrespective of the branch.  
This module is a lightweight node.js application will accept posts from github and bitbucket, parse which repository and branch were committed to, and based on that will forward the request and token to a configured url.
