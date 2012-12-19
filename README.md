KBase Data Visualization Library
================================
The library provides web-based client-side JavaScript visualizations for the KBase project. It also includes a reference server that provides service endpoints for data exchange. The server both transforms data from the KBase API for direct use by the visualization modules and caches data for performance.

Dependencies
------------
* [Node.js](http://nodejs.org/ "node.js")
* [Git](http://git-scm.com/ "Git")

Installation
------------

    $ git submodule update --init
    $ npm install
    $ cd external/jquery
    $ npm install
    $ ./node_modules/grunt/bin/grunt
    $ cd ../..

Deployment
----------

1. Start the the app:
        
        $ node app.js

2. Point your browser at [http://0:3000](http://0:3000)
