Iris
====
A web application for exploration of biological data

DEPENDENCIES
------------
* node (nodejs.org)
* git (git-scm.com)
* gcc
* mongodb (mongodb.org)

INSTALLATION
------------
    $ source iris.env
    $ iris install
    
CONFIGURATION
-------------
Iris services are configured in a simple configuration file in `conf/services.json` listing an HTTP port, the name of the service, the Node.js control file, and a configuration file. A sample services configuration is available at `conf/services-sample.json`. To get started:

    $ cp conf/services-sample.json conf/services.json

RUNNING IRIS
------------
    $ iris start

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
