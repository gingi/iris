Iris
====
A web application for exploration of biological data

DEPENDENCIES
------------
* node (nodejs.org)
* npm (npmjs.org)
* git (git-scm.com)
* gcc
* mongodb (mongodb.org)

INSTALLATION
------------
TODO: Make installation more streamlined....

    # Fetch git-managed modules
    git submodule init
    git submodule update

    # Install FastBit
    cd fastbit
    ./configure --prefix $(cd .. && pwd -P)
    make        # Now take a [long] coffee break
    make check
    make install

    # Install Node.js dependencies
    cd ../nodejs
    npm install
    
    # Compile jQuery library
    cd external/jquery
    git submodule init && git submodule update
    make

RUNNING IRIS
------------
    $ cd nodejs
    $ node app.js

PROJECT STRUCTURE
-----------------
The Iris server is run out of `/nodejs`. `/nodejs` also contains the Express
routes (`app.js` and `routes/`) and Jade templates (`views/`).

Client-side rendering code (HTML, CSS, Javascript) is organized under `/root`. All client-side Javascript is in `/root/js`. The `widgets/` directory contains the widget code, while all utility, administrative, and external scripts (`jquery.js`, `bootstrap`) should be placed at the Javascript root.

The Fastbit source code, including pristine and Iris-specific is under the `/fastbit` directory, but compiled artifacts are placed in folders at the root directory (`/bin`, `/lib`, `/share`, `/include`).

NOTES
-----
All the conventions above are so far tentative and up for discussion.

---
Copyright (c) 2012 Ware Lab, Cold Spring Harbor Laboratory
