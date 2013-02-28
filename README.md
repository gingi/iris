Iris
====
**Version 0.1.0**
A web library for data visualization and exploration.

##External Dependencies
The following tools need to be installed separately (e.g., with [Homebrew](http://mxcl.github.com/homebrew/)) before Iris and its dependencies can be installed:

* node (nodejs.org)
* git (git-scm.com)

##Overview
Iris is equipped with a command-line tool, quaintly named `iris`, to manage the project. It can be used to install dependencies, start Iris and it services, monitor Iris, and shut it down.

To use the tool, run:

    source iris.env

##Installation
To install Iris, along with its dependencies, run:

    iris install

To check the installation, and execute project tests, run:

    iris check

To install example data used by the demo, run:

    iris examples

##Configuration
Iris services are configured in a simple configuration file in `conf/services.json` listing an HTTP port, the name of the service, the Node.js control file, and a configuration file. A sample services configuration is available at `conf/services-sample.json`. To get started:

    cp conf/services-sample.json conf/services.json

##Running Iris
To start Iris, run:

    iris start

All the services configured in `conf/services.json` are started. Their process IDs and network ports are listed.

To stop Iris, run:

    iris stop

To restart Iris, run:

    iris restart

To determine whether Iris and its services are running, run:

    iris status

Each of the above management commands can be run on individual services by supplying the service name as an argument:

    iris {start,stop,restart,status} <service-name>

##More Help
The `iris` tool has a general and command-specific help facility. To find out more about it, run:

    iris help [<command>]

##Project Structure
The Iris server is run out of `/nodejs`. `/nodejs` also contains the Express
routes (`app.js` and `routes/`) and Jade templates (`views/`).

Client-side rendering code (HTML, CSS, Javascript) is organized under `/root`. All client-side Javascript is in `/root/js`. The `widgets/` directory contains the widget code, while all utility, administrative, and external scripts (`jquery.js`, `bootstrap`) should be placed at the Javascript root.

The Snapdragon source code, including pristine and Iris-specific is under the `/snapdragon` directory, but compiled artifacts are placed in folders at the root directory (`/bin`, `/lib`, `/share`, `/include`).

## Library Deployment
The client-side JavaScript libraries that drive all the visualizations are managed in separate module files using RequireJS, but they can be packaged into a single library that can be dropped into any page. To build that library, run

    make dist

Which will, by default, create a minified library as '`dist/iris.js`'. To specify a different output file for the library, use the `DISTLIB=/path/to/target.js`. To avoid minification (useful for debugging), add `MINIFY=0`. For example, to create a non-optimized library as `/tmp/foo.js`, run:

    make dist MINIFY=0 DISTLIB=/tmp/foo.js


## Visualization Example
The client-side library can be used on the browser as in the following example:

    <!DOCTYPE html>
    <head>
        <link rel="stylesheet" href="kbase.css" type="text/css">
        <script src="iris.js" type="text/javascript"></script>
        <script>
            iris.require(['charts/bar'], function (Chart) {
                var chart = new Chart({
                    element: "body",
                    // other options
                });
                chart.setData([ /* Data here */ ]);
                chart.render();
            });
        </script>
    </head>
    <body>
    </body>

##Coding Style and Conventions
TODO

##Changelog
####v0.1.0

* Server-side and client-side error handling.
* Inline help documentation for the workbench apps.
* Added KBase look-and-feel. Integrated FontAwesome for icons.
* Build an optimized distribution package of the library for external use.
* Production environment: Using separate configuration, optimized client-side assets (CSS, JS, HTML).
* Shared templates across apps.
* *Network renderer*: Hiding nodes, highlighting nodes, colored edges, node labels, performance improvements.
* *Manhattan renderer*: highlighting loci.
* *Heatmap renderer*: Axes.
* Various UI enhancements, including dragging of elements like the dock, HUDs, and viewports.
* Added viewports with a customizable, auto-hidden toolbox for data export and window controls (rearrange, maximize)
* Improved progress indicators.

####v0.0.3

## License

    Copyright (c) 2012-2013 Jer-Ming Chia <jermth at gmail.com>
    Copyright (c) 2012-2013 Andrew Olson <aolson at me.com>
    Copyright (c) 2012-2013 Shiran Pasternak <shiranpasternak at gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to
    deal in the Software without restriction, including without limitation the
    rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions: The above
    copyright notice and this permission notice shall be included in all copies
    or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
