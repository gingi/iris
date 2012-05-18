(function () {
    var schema = {
        properties: {
            target: {
                type: 'object',
                required: true
            },
            data: {
                type: 'object',
                properties: {
                    data: {
                        required: true,
                        type: 'array',
                        items: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    },
                    header: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    };
    var renderer = Iris.Renderer.extend({
      about: {
	name: "table",
	    title: "Table",
            author: "Tobias Paczian",
            version: "1.0",
            requires: [],
            defaults: {
	    'width': null,
	      'height': null,
	      'rows_per_page': 10,
	      'sortcol': 0,
	      'sorted': false,
	      'offset': 0,
	      'sortdir': 'asc',
	      'filter': {},
	      'target': 'table_space',
	      'data': 'exampleData()'
	      },
            dataFormat: "list of list of 2-tuple of float"
	    },
	  exampleData: function () {
	  return {
	  data: [
		 ["a1", "b1", "c1"],
		 ["a3", "b2", "c2"],
		 ["a4", "b3", "c3"],
		 ["a2", "b4", "c4"],
		 ["a1", "b1", "c1"],
		 ["a3", "b2", "c2"],
		 ["a4", "b3", "c3"],
		 ["a2", "b4", "c4"],
		 ["a1", "b1", "c1"],
		 ["a3", "b2", "c2"],
		 ["a4", "b3", "c3"],
		 ["a2", "b4", "c4"],
		 ["a1", "b3", "c1"],
		 ["a3", "b2", "c2"],
		 ["a4", "b3", "c3"],
		 ["a2", "b4", "c4"],
		 ["a5", "b5", "c5"]
		 ],
	      header: ["column A", "column B", "column C"]
	      };
        },
	  render: function (options) {
	  
	  options.target.innerHTML = "";

	  // check if we have a header, otherwise interpret the first line as the header
	  if (options.data.length) {
	    options.data = { header: options.data[0], data: options.data };
	  }

	  // if a header has already been initialized, don't touch it again
	  var header;
	  if (options.header) {
	    header = options.header;
	  } else {
	    header = options.data.header;
	    if (!options.data.header) {
	      header = options.data.data.shift();
	    }
	    options.header = header;
	    options.data.header = null;
	  }
	  
	  // check if we have already parsed the data
	  var tdata = [];
	  if (options.tdata) {
	    tdata = options.tdata;
	  } else {

	    // the data has not been parsed, do it now
	    for (i=0;i<options.data.data.length; i++) {
	      tdata[tdata.length] = {};
	      for (h=0;h<options.data.data[i].length;h++) {
		tdata[tdata.length - 1][header[h]] = options.data.data[i][h];
	      }
	    }
	    options.tdata = tdata;
	    options.data.data = null;
	  }

	  var filter = options.filter;
	  var filter_present = false;
	  for (i in filter) {
	    filter_present = true;
	    break;
	  }
	  if (filter_present) {
	    var newdata = [];
	    for (i in filter) {
	      var re = new RegExp(filter[i].searchword);
	      filter[i].re = re;
	    }
	    for (h=0; h<tdata.length; h++) {
	      var pass = 1;
	      for (i in filter) {		
		if (! tdata[h][filter[i].column].match(filter[i].re)) {
		  pass = 0;
		  break;
		}
	      }
	      if (pass) {
		newdata.push(tdata[h]);
	      }
	    }
	    tdata = newdata;
	  }
	  
	  // initialize the options
	  var offset = options.offset;
	  var rows = options.rows_per_page;
	  var sortcol = options.sortcol;
	  var sortdir = options.sortdir;
	  var target = options.target;

	  // check for data filtering

	  // check width and height
	  var defined_width = "";
	  if (options.width) {
	    defined_width = "width: " + options.width + "px; ";
	  }
	  var defined_height = "";
	  if (options.height) {
	    defined_height = "height: " + options.height + "px; ";
	  }
	  
	  // create the actual table header
	  var table_element = document.createElement("table");
	  table_element.setAttribute("class", "table table-striped table-bordered table-condensed");
	  table_element.setAttribute("style", "margin-bottom: 2px;");
	  var thead = document.createElement("thead");
	  var tr = document.createElement("tr");
	  for (i=0;i<header.length;i++) {
	  
	    // create sorting elements
	    var asc = document.createElement("i");
	    asc.setAttribute("class", "icon-chevron-down");
	    asc.setAttribute("title", "sort ascending");
	    var desc = document.createElement("i");
	    desc.setAttribute("class", "icon-chevron-up");
	    desc.setAttribute("title", "sort descending");
 	    if (i == sortcol) {
 	      if (sortdir=='asc') {
 		asc.setAttribute("class", "icon-chevron-down icon-white");
		asc.setAttribute("title", "current sorting: ascending");
		desc.setAttribute("style", "cursor: pointer;");
		desc.i = i;
		desc.onclick = function () {
		  options.sortcol = this.i;
		  options.sorted = false;
		  options.sortdir = 'desc';
		  renderer.render(options);
		}
 	      } else {
 		desc.setAttribute("class", "icon-chevron-up icon-white");
		desc.setAttribute("title", "current sorting: descending");
		asc.setAttribute("style", "cursor: pointer;");
		asc.i = i;
		asc.onclick = function () {
		  options.sortcol = this.i;
		  options.sorted = false;
		  options.sortdir = 'asc';
		  renderer.render(options);
		}
 	      }
	    } else {
	      asc.setAttribute("style", "cursor: pointer;");
	      asc.i = i;
	      asc.onclick = function () {
		options.sortcol = this.i;
		options.sorted = false;
		options.sortdir = 'asc';
		renderer.render(options);
	      }
	      desc.setAttribute("style", "cursor: pointer;");
	      desc.i = i;
	      desc.onclick = function () {
		options.sortcol = this.i;
		options.sorted = false;
		options.sortdir = 'desc';
		renderer.render(options);
	      }
	    }

	    // create filter element
	    var filter_elem = document.createElement("input");
	    if (filter[i]) {
	      filter_elem.value = filter[i].searchword;
	    }
	    filter_elem.setAttribute("style", "float: right; position: relative; right: 5px;");
	    filter_elem.i = i;
	    filter_elem.onkeypress = function (e) {
	      e = e || window.event;
	      if (e.keyCode == 13) {
		var filter_item = {};
		filter_item.column = header[this.i];
		filter_item.searchword = this.value;
		options.filter[this.i] = filter_item;
		renderer.render(options);
	      }
	    };

	    // build header cell
	    var caret = document.createElement("table");
	    caret.setAttribute("style", "float: right");
	    caret_tr1 = document.createElement("tr");
	    caret_td1 = document.createElement("td");
	    caret_td1.setAttribute("style", "background-color: #CCC; padding: 0px 2px; line-height: 0px; -moz-border-radius: 4px; border-left: none;");
	    caret_tr2 = document.createElement("tr");
	    caret_td2 = document.createElement("td");
	    caret_td2.setAttribute("style", "background-color: #CCC; padding: 0px 2px; line-height: 0px; -moz-border-radius: 4px; border-left: none;");
	    caret_td1.appendChild(desc);
	    caret_td2.appendChild(asc);
	    caret_tr1.appendChild(caret_td1);
	    caret_tr2.appendChild(caret_td2);
	    caret.appendChild(caret_tr1);
	    caret.appendChild(caret_tr2);
	    var th = document.createElement("th");
	    th.setAttribute("style", "padding: 0px; padding-left: 4px;");
	    var th_div = document.createElement("div");
	    th_div.setAttribute("style", "float: left; position: relative; top: 4px;");
	    th_div.innerHTML = header[i];
	    th.appendChild(th_div);
	    th.appendChild(caret);
	    th.appendChild(filter_elem);
	    tr.appendChild(th);
	  }
	  thead.appendChild(tr);
	  table_element.appendChild(thead);
	  var tinner_elem = document.createElement("tbody");
	  
	  // check if the data is sorted, otherwise sort now
	  var disp;
	  if (options.sorted) {
	    disp = tdata;
	  } else {
	    disp = tdata.sort(function (a,b) {
	      if (sortdir == 'desc') {
		var c = a; a=b; b=c;
	      }
	      if (a[header[sortcol]]==b[header[sortcol]]) return 0;
	      if (a[header[sortcol]]<b[header[sortcol]]) return -1;
	      return 1; });
	    options.sorted = true;
	  }

	  // select the part of the data that will be displayed
	  disp = disp.slice(offset, offset+rows);

	  // create the table rows
	  for (i=0;i<disp.length;i++) {
	    var tinner_row = document.createElement("tr");
	    for (h=0; h<header.length; h++) {
	      var tinner_cell = document.createElement("td");
	      tinner_cell.innerHTML = disp[i][header[h]];
	      tinner_row.appendChild(tinner_cell);
	    }
	    tinner_elem.appendChild(tinner_row);
	  }

	  // render the table
	  table_element.appendChild(tinner_elem);

	  // create the navigation
	  // first, previous
	  var prev_td = document.createElement("td");
	  prev_td.setAttribute("style", "text-align: left; width: 45px;");
	  prev_td.innerHTML = "&nbsp;";
	  if (offset > 0) {
	    var first = document.createElement("i");
	    first.setAttribute("class", "icon-fast-backward");
	    first.setAttribute("title", "first");
	    first.setAttribute("style", "cursor: pointer;");
	    first.onclick = function () {
	      options.offset = 0;
	      renderer.render(options);
	    }
	    var prev = document.createElement("i");
	    prev.setAttribute("class", "icon-step-backward");
	    prev.setAttribute("title", "previous");
	    prev.setAttribute("style", "cursor: pointer;");
	    prev.onclick = function () {
	      options.offset -= rows;
	      if (options.offset < 0) {
		options.offset = 0;
	      }
	      renderer.render(options);
	    }
	    prev_td.appendChild(first);
	    prev_td.appendChild(prev);
	  }

	  // next, last
	  var next_td = document.createElement("td");
	  next_td.setAttribute("style", "text-align: right; width: 45px;");
	  next_td.innerHTML = "&nbsp;";
	  if (offset + rows < tdata.length) {
	    var last = document.createElement("i");
	    last.setAttribute("class", "icon-fast-forward");
	    last.setAttribute("title", "last");
	    last.setAttribute("style", "cursor: pointer;");
	    last.onclick = function () {
	      options.offset = tdata.length - rows;
	      if (options.offset < 0) {
		options.offset = 0;
	      }
	      renderer.render(options);
	    }
	    var next = document.createElement("i");
	    next.setAttribute("class", "icon-step-forward");
	    next.setAttribute("title", "next");
	    next.setAttribute("style", "cursor: pointer;");
	    next.onclick = function () {
	      options.offset += rows;
	      if (options.offset > tdata.length - 1) {
		options.offset = tdata.length - rows;
		if (options.offset < 0) {
		  options.offset = 0;
		}
	      }
	      renderer.render(options);
	    }
	    next_td.appendChild(next);
	    next_td.appendChild(last);
	  }

	  // display of window offset
	  var showing = document.createElement("td");
	  showing.setAttribute("style", "text-align: center;");	  
	  showing.innerHTML = "showing "+ (offset + 1) +"-"+(disp.length + offset)+" of "+tdata.length;

	  // create the table to host navigation
	  var bottom_table = document.createElement("table");
	  bottom_table.setAttribute("style", "width: 100%");
	  var bottom_row = document.createElement("tr");
	  bottom_row.appendChild(prev_td);
	  bottom_row.appendChild(showing);
	  bottom_row.appendChild(next_td);
	  bottom_table.appendChild(bottom_row);


	  // goto
	  var goto_text = document.createElement("input");
	  goto_text.setAttribute("value", offset + 1);
	  goto_text.setAttribute("class", "span1");
	  var goto_button = document.createElement("input");
	  goto_button.setAttribute("type", "button");
	  goto_button.setAttribute("value", "go");
	  goto_button.setAttribute("class", "btn");
	  goto_button.onclick = function () {
	    options.offset = parseInt(goto_text.value) - 1;
	    renderer.render(options);
	  };
	  	  
	  // append navigation to target element
	  target.appendChild(table_element);
	  target.appendChild(bottom_table);
	  target.appendChild(goto_text);
	  target.appendChild(goto_button);

	  var clear_btn = document.createElement("input");
	  clear_btn.setAttribute("type", "button");
	  clear_btn.setAttribute("class", "btn");
	  clear_btn.setAttribute("value", "clear all filters");
	  clear_btn.onclick = function () {
	    options.filter = {};
	    options.sorted = false;
	    renderer.render(options);
	  };
	  
	  target.appendChild(clear_btn);

	  // rows per page
	  var perpage = document.createElement("input");
	  perpage.setAttribute("type", "text");
	  perpage.setAttribute("value", rows);
	  perpage.setAttribute("style", "width: 30px;");
	  perpage.onkeypress = function (e) {
	      e = e || window.event;
	      if (e.keyCode == 13) {
		options.rows_per_page = this.value;
		renderer.render(options);
	      }
	    };
	  var ppspan1 = document.createElement("span");
	  ppspan1.innerHTML = " show ";
	  var ppspan2 = document.createElement("span");
	  ppspan2.innerHTML = " rows at a time";
	  target.appendChild(ppspan1);
	  target.appendChild(perpage);
	  target.appendChild(ppspan2);
	}
      });
 }).call(this);
