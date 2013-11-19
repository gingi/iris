# Iris
![Iris Logo][logo]

**Version 0.2.5**

A web library for data visualization and exploration.

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

##Changelog

####v0.2.5

* Page load optimizations
* Bug fixes

####v0.2.2

* Using LESS for CSS management
* Production build optimization
* Bug fixes

####v0.2

* Bubble Plot widget
* Simplified server deployment
* Documentation
* Bootstrap 3.0
* Bug fixes and improvements
* Improved API

####v0.1

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

 [logo]: https://raw.github.com/gingi/iris/master/public/img/iris-logo-tiny.png
 [status-img]: https://travis-ci.org/gingi/iris.png
 [status]: https://travis-ci.org/gingi/iris
 [brew]: http://mxcl.github.com/homebrew
 [node]: http://nodejs.org
 [git]: http://git-scm.com
 [cairo]: http://cairographics.org
 [requirejs]: http://requirejs.org