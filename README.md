# Iris
A web library for data visualization and exploration

![Iris Logo][logo]

**Version 0.2.7**

[![Build Status][status-img]][status]

##External Dependencies
The following tools need to be installed separately (e.g., with [Homebrew][brew]) before Iris and its dependencies can be installed:

* [Node.js][node]
* [Git][git]
* [Cairo][cairo] (*for testing only*)

##Overview
Iris is a browser-side library for data visualization widgets written in JavaScript. In addition to a set of widgets, it also includes an API for extending them or building new ones.

The Iris module is equipped with several directives:

* Ensure Iris dependencies are installed:

        make init

* Run the Iris unit-test suite:

        iris check

* To run Iris:

        node app

## Library Deployment
The JavaScript libraries are managed in separate module files using [RequireJS][requirejs], but they can be packaged into a single library that can be dropped into any page. To build that library, run

    make dist

Which will, by default, create a minified library as '`dist/iris.js`'. To specify a different output file for the library, use the `DISTLIB=/path/to/target.js`.

## Widget Example
The client-side library can be used on the browser as in the following example:

    <!DOCTYPE html>
    <head>
        <link rel="stylesheet" href="iris.css" type="text/css">
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

 [logo]: https://raw.github.com/gingi/iris/master/public/img/iris-logo-tiny.png
 [status-img]: https://travis-ci.org/gingi/iris.png
 [status]: https://travis-ci.org/gingi/iris
 [brew]: http://mxcl.github.com/homebrew
 [node]: http://nodejs.org
 [git]: http://git-scm.com
 [cairo]: http://cairographics.org
 [requirejs]: http://requirejs.org