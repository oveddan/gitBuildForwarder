# gitBuildForwarder

	Forwards commits to continuous integration servers based on the branchs that were committed to

## Overview

	With Github and Bitbucket standard integrations with CI servers, there is no option to trigger a specific build when a specific branch is committed to; builds can only be triggered when the repository is committed to. This prevents the abilitity to have branch specific build jobs that get automatically triggered when code is committed to the corresponding branch. 

	The gitBuildForwarder is a lightweight Node.js module that accepts posts from from bitbucket when code is committed, determine which repository and branch were committed to, and based on that will trigger the corresponding build(s) on the continuous integration server for the branch(es) that were committted to.

	In the future, this will also work with Github repositories.

## Setup

	The best way to see how to setup an app is to look at the integration tests.

## Running tests

  Install dev dependencies:
  
    $ npm install -d

  Run the tests:

    $ make test

  Run the integration tests:

  	$ make testintegration

## License 

(The MIT License)

Copyright (c) 2012 Dan Oved &lt;stangogh@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
