Ext.data.JsonP.Renderer({"tagname":"class","name":"Renderer","autodetected":{},"files":[{"filename":"renderer.js","href":"renderer.html#Renderer"}],"extends":"Root","singleton":true,"members":[{"name":"constructor","tagname":"method","owner":"Root","id":"method-constructor","meta":{}},{"name":"exampleData","tagname":"method","owner":"Renderer","id":"method-exampleData","meta":{"deprecated":{"text":"\n"}}},{"name":"extend","tagname":"method","owner":"Root","id":"method-extend","meta":{}},{"name":"getData","tagname":"method","owner":"Renderer","id":"method-getData","meta":{}},{"name":"initialize","tagname":"method","owner":"Root","id":"method-initialize","meta":{}},{"name":"register","tagname":"method","owner":"Renderer","id":"method-register","meta":{}},{"name":"render","tagname":"method","owner":"Renderer","id":"method-render","meta":{}},{"name":"set","tagname":"method","owner":"Renderer","id":"method-set","meta":{}},{"name":"setData","tagname":"method","owner":"Renderer","id":"method-setData","meta":{}},{"name":"update","tagname":"method","owner":"Renderer","id":"method-update","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-Renderer","short_doc":"A base class that handles the display of specific data. ...","component":false,"superclasses":["Root"],"subclasses":["BarChart","Manhattan","ParallelCoordinatesPlot","Table"],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Root' rel='Root' class='docClass'>Root</a><div class='subclass '><strong>Renderer</strong></div></div><h4>Subclasses</h4><div class='dependency'><a href='#!/api/BarChart' rel='BarChart' class='docClass'>BarChart</a></div><div class='dependency'><a href='#!/api/Manhattan' rel='Manhattan' class='docClass'>Manhattan</a></div><div class='dependency'><a href='#!/api/ParallelCoordinatesPlot' rel='ParallelCoordinatesPlot' class='docClass'>ParallelCoordinatesPlot</a></div><div class='dependency'><a href='#!/api/Table' rel='Table' class='docClass'>Table</a></div><h4>Files</h4><div class='dependency'><a href='source/renderer.html#Renderer' target='_blank'>renderer.js</a></div></pre><div class='doc-contents'><p>A base class that handles the display of specific data.</p>\n\n<pre class='inline-example '><code>// Create instance\nvar renderer = new <a href=\"#!/api/Iris-property-Renderer\" rel=\"Iris-property-Renderer\" class=\"docClass\">Iris.Renderer</a>({ foo: \"bar\" });\n</code></pre>\n\n<p>Or:</p>\n\n<pre class='inline-example '><code>// Extend <a href=\"#!/api/Iris-property-Renderer\" rel=\"Iris-property-Renderer\" class=\"docClass\">Iris.Renderer</a>\nvar MyRenderer = Iris.Renderer.extend({\n    render: function () {}\n});\nvar renderer = new MyRenderer({ element: \"#datavis\" });\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Root' rel='Root' class='defined-in docClass'>Root</a><br/><a href='source/root.html#Root-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Root-method-constructor' class='name expandable'>Renderer</a>( <span class='pre'>options</span> ) : <a href=\"#!/api/Root\" rel=\"Root\" class=\"docClass\">Root</a><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><div class='sub-desc'><p>Constructor options.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Root\" rel=\"Root\" class=\"docClass\">Root</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-exampleData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Renderer'>Renderer</span><br/><a href='source/renderer.html#Renderer-method-exampleData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Renderer-method-exampleData' class='name expandable'>exampleData</a>( <span class='pre'></span> )<span class=\"signature\"><span class='deprecated' >deprecated</span></span></div><div class='description'><div class='short'>Returns example data, used to demo renderer. ...</div><div class='long'><p>Returns example data, used to demo renderer.</p>\n        <div class='rounded-box deprecated-box deprecated-tag-box'>\n        <p>This method has been <strong>deprected</strong> </p>\n        \n\n        </div>\n</div></div></div><div id='method-extend' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Root' rel='Root' class='defined-in docClass'>Root</a><br/><a href='source/root.html#Root-method-extend' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Root-method-extend' class='name expandable'>extend</a>( <span class='pre'>object</span> ) : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Extends the class. ...</div><div class='long'><p>Extends the class.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>object</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><div class='sub-desc'><p>A hash of functions and object that extend the class</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a></span><div class='sub-desc'><p>A new subclass of this class.</p>\n</div></li></ul></div></div></div><div id='method-getData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Renderer'>Renderer</span><br/><a href='source/renderer.html#Renderer-method-getData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Renderer-method-getData' class='name expandable'>getData</a>( <span class='pre'></span> ) : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Get the data used for rendering. ...</div><div class='long'><p>Get the data used for rendering.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a></span><div class='sub-desc'><p>The data</p>\n</div></li></ul></div></div></div><div id='method-initialize' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Root' rel='Root' class='defined-in docClass'>Root</a><br/><a href='source/root.html#Root-method-initialize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Root-method-initialize' class='name expandable'>initialize</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Initializes the object. ...</div><div class='long'><p>Initializes the object. Invoked after constructor has already\nprocessed parameters.</p>\n</div></div></div><div id='method-register' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Renderer'>Renderer</span><br/><a href='source/renderer.html#Renderer-method-register' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Renderer-method-register' class='name expandable'>register</a>( <span class='pre'>name, renderer</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Registers an object within this namespace. ...</div><div class='long'><p>Registers an object within this namespace.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : <a href=\"#!/api/String\" rel=\"String\" class=\"docClass\">String</a><div class='sub-desc'><p>The name of the renderer</p>\n</div></li><li><span class='pre'>renderer</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><div class='sub-desc'><p>The renderer to register</p>\n</div></li></ul><p>Overrides: <a href=\"#!/api/Root-method-register\" rel=\"Root-method-register\" class=\"docClass\">Root.register</a></p></div></div></div><div id='method-render' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Renderer'>Renderer</span><br/><a href='source/renderer.html#Renderer-method-render' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Renderer-method-render' class='name expandable'>render</a>( <span class='pre'>args</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Renders a data visualization. ...</div><div class='long'><p>Renders a data visualization.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><div class='sub-desc'><p>Runtime rendering arguments.</p>\n\n</div></li></ul></div></div></div><div id='method-set' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Renderer'>Renderer</span><br/><a href='source/renderer.html#Renderer-method-set' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Renderer-method-set' class='name expandable'>set</a>( <span class='pre'>args</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Set renderer options. ...</div><div class='long'><p>Set renderer options.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><div class='sub-desc'><ul>\n<li>key-value pair of options.</li>\n</ul>\n\n</div></li></ul></div></div></div><div id='method-setData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Renderer'>Renderer</span><br/><a href='source/renderer.html#Renderer-method-setData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Renderer-method-setData' class='name expandable'>setData</a>( <span class='pre'>The</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the data used for rendering. ...</div><div class='long'><p>Sets the data used for rendering.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>The</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><div class='sub-desc'><p>data</p>\n\n</div></li></ul></div></div></div><div id='method-update' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Renderer'>Renderer</span><br/><a href='source/renderer.html#Renderer-method-update' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Renderer-method-update' class='name expandable'>update</a>( <span class='pre'>args</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Updates the visualization. ...</div><div class='long'><p>Updates the visualization. Used for handling changes to underlying\ndata.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><div class='sub-desc'><p>Runtime update arguments.</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});