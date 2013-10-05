# KBase Data Visualization Library
**Version 0.2.0**

The library provides web-based client-side JavaScript visualizations for [the KBase project](http://kbase.us). It also includes a reference server that provides service endpoints for data exchange. The server both transforms data from the KBase API for direct use by the visualization modules and caches data for performance.

The library makes heavy use of the excellent [D3.js](http://d3js.org/ "D3.js") library, although some novel visualizations are written using native HTML5 technologies such as Canvas and SVG. And just like almost every JavaScript library, it relies on [jQuery](http://jquery.com/ "jQuery").

The code is managed with [RequireJS](http://requirejs.org/ "RequireJS") for Asynchronous Module Definition (AMD). This allows the separation of various modules and greatly helps in development.

The library includes a distribution mechanism that wraps all the renderers and external dependencies into a single library that can be dropped into any page (see below).

##Dependencies
* [Node.js](http://nodejs.org/ "node.js")
* [Git](http://git-scm.com/ "Git")

##Installation
Various external modules are managed either through [NPM](https://npmjs.org/ "npm") or as Git modules. They can be downloaded and installed by running:

    make init

The client-side JavaScript libraries that drive all the visualizations are managed in separate module files using RequireJS, but they can be packaged into a single library that can be dropped into any page. To build that library, run

    make dist

Which will, by default, create a minified library as '`dist/datavis.js`'. To specify a different output file for the library, use the `DISTLIB=/path/to/target.js`. To avoid minification (useful for debugging), add `MINIFY=0`. For example, to create a non-optimized library as `/tmp/foo.js`, run:

    make dist MINIFY=0 DISTLIB=/tmp/foo.js


##Server Deployment
The provided server connecting to the KBase API can be started by

    node app

This starts the web server at [http://0:3000](http://0:3000), which shows various widgets that make use of the visualization library. The startup script takes the following options:

* `--cache`: Use a [Redis](http://redis.io/ "Redis") cache for API endpoints (Redis must be running)
* `--debug`: Prints debug information, including RPC calls to the API
* `--env  `: Run in either `production` or `development` mode (see below). If not set, will fall back on the `NODE_ENV` environment variable.
* `--port `: The network port to use

Run `node app --help` for information on other options.

###Use in Production
The app can be run in production mode, which has a different configuration and serves optimized client code. The optimized code is generated as a copy of the `/public` directory saved in `/build`. To generate the optimized code, run:

    make build
    
To run the app in production mode, run

    node app --env production

##Usage and Documentation
The client-side library can be used on the browser as in the following example:

    <!DOCTYPE html>
    <head>
        <link rel="stylesheet" href="kbase.css" type="text/css">
        <script src="datavis.js" type="text/javascript"></script>
        <script>
            datavis.require(['charts/bar'], function (Chart) {
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

Please refer to the [API documentation](https://bitbucket.org/gingi/kbase-datavis/src/master/dist/doc/index.html) for more information on available renderers and options.

##Changelog
####v0.2.0

* Bootstrap 3
* Built library now compatible with external libraries
* Small improvements

####v0.1.1

* Minor fixes and improvements

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
* **Genotype Phenotype Workbench**: Connected widgets for expression, networks, and function; Gene Pad for inputting custom list of genes, breadcrumbs for entity selection.
* **Network Workbench**: Defined user story — fetch clusters associated with docked genes, then add cluster members shared with the docked genes having multiple interactions ("co-neighbors"); added cluster table for hiding/unhiding clusters; internal network for docked genes.
* Added viewports with a customizable, auto-hidden toolbox for data export and window controls (rearrange, maximize)
* Improved progress indicators.
* Updated KBase APIs; endpoints managed in environment-specific configuration.

####v0.0.3

* Wrapping widgets in Viewports.
* *Heatmap renderer*: Auto-resizing based on parent dimensions.
* *Manhattan renderer*: Axes, labels
* GO Enrichment widget.
* Dropdowns for selection of genomes, experiments, traits.
* Pie and bar chart renderers.
* Handling of asynchronous requests.
* API functionality now maintained in kbase façade object.
* Web caching for API paths.
* Handling of chunked HTTP (Experimental).

####v0.0.2

* *Network renderer*: introduced dock for anchoring genes, double-clicking to add new nodes, info box on node click.
* Reusable renderer modules.
* Added Bootstrap.

## License

    Copyright (c) 2012-2013 Shiran Pasternak, <shiranpasternak at gmail.com>

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
