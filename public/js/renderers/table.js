define(["jquery", "underscore", "iris", "datatables", "columnfilter"], function (JQ, _, iris) {
    /**
     * @class Table
     * A table with sort, filter, and search
     * 
     * @extends Renderer
     */
    var Table = iris.Renderer.extend({
        about: {
            title: "Table",
            author: "Shiran Pasternak",
            description: "A table with sort, filter, and search features"
        },
        defaults: {
            scrollY: 300,
            element: "body",
            rowCallback: function () {},
            filter: false
        },
        initialize: function () {
            this.filterExclude = [];
            this.$table =
                JQ("<table>").addClass('table table-striped table-bordered');
            dataTableBehavior();
        },
        /**
         * @method setData
         * Sets data. If the data is an {#link Array}, converts
         * @inheritdoc Renderer#setData
         */
        setData: function (data) {
            if (_.isArray(data)) {
                this.columns = _.first(data);
                this.data = _.rest(data);
            } else {
                this.columns = data.columns;
                this.data = data.data;
            }
            if (this.columns === undefined)
                this.columns = [];
            this.datafilter = this.datafilter || [];
            for (var i = 0; i < this.columns.length; i++) {
                if (!_.contains(this.datafilter, this.columns[i])) {
                    this.filterExclude.push(i);
                }
            }
        },
        /**
         * @method render
         * @inheritdoc Renderer#render
         */
        render: function (args) {
            var self = this;
            args = args ? _.clone(args) : {};
            var options = self.options;
            var $element = JQ(options.element);
            var elementOffset = $element.offset();
            $element.empty().append(self.$table);
            var cols = _.map(self.columns, function (d) {
                return { sTitle: d, type: "string" };
            });
            options.scrollY = Math.max($element.height()-100, options.scrollY);
            var dataTable = self.$table.dataTable({
                sInfo: "muted",
                aaData: self.data,
                aoColumns: cols,
                sPaginationType: "bootstrap",
                bAutoWidth: true,
                sScrollY: options.scrollY,
                sScrollX: "100%",
                bPaginate: false,
                oLanguage: {
                    sLengthMenu: "_MENU_ per page",
                    sInfoThousands: ","
                },
                fnRowCallback: function (tr, data) {
                    options.rowCallback.call(tr, data);
                },
                fnDrawCallback: args.success
            });
            var thead = self.$table.parent().prev().find("thead");
            var theadRow = thead.find("tr");
            if (options.filter) {
                var clone    = JQ("<tr>");
                theadRow.children().each(function () {
                    clone.append(JQ(this).clone());
                });
                thead.append(clone);
                self.$table.columnFilter({
                    bUseColVis: true,
                    sPlaceHolder: "head:after",
                    aoColumns: _.map(cols, function (d) {
                        return { type: "text", bRegex: true }
                    })
                });
            }
            theadRow = thead.find("tr").filter(":first");
            
            // Control FontAwesome buttons
            theadRow.children().click(function (event) {
                var $elem = JQ(this);
                theadRow.find("i").removeClass(function (j, css) {
                    return (css.match(/fa-sort-\S*/g) || []).join(" ");
                });
                var sortClass = $elem.attr("class");
                if (sortClass == "sorting_asc") {
                    $elem.find("i").addClass("fa-sort-asc");
                } else {
                    $elem.find("i").addClass("fa-sort-desc");
                }
            });
            thead.find("input").addClass("form-control input-xs");

            theadRow.children().each(function () {
                JQ(this).append(JQ("<i>", { class: "fa fa-sort" }));
            });

            self.$table.on("filter", function (event, tbl) {
                var filtered = _.map(tbl.aiDisplay, function (index) {
                    return self.data[index];
                });
                self.trigger("table:filter", [ filtered ]);
            });
            self.$table.dataTableExt.afnFiltering.push(
            function (settings, data, index) {
                // TODO: Apply user-supplied filter
                return true;
            });
            self.filter();
        },
        filter: function () {
            this.$table.fnDraw();
        },
        exampleData: function () {
            return {
                data: [
                    ["Clayton Kershaw", 236.0, 164, 55, 48, 52, 232, 1.77778],
                    ["Jose Fernandez", 172.2, 111, 47, 42, 58, 187, 2],
                    ["Matt Harvey", 178.1, 135, 46, 45, 31, 191, 1.8],
                    ["Anibal Sanchez", 182.0, 156, 56, 52, 54, 202, 1.75],
                    ["Zack Greinke", 177.2, 152, 54, 52, 46, 148, 3.75],
                    ["Bartolo Colon", 190.1, 193, 60, 56, 29, 117, 3],
                    ["Hisashi Iwakuma", 219.2, 179, 69, 65, 42, 185, 2.33333],
                    ["Madison Bumgarner", 201.1, 146, 68, 62, 62, 199, 1.44444],
                    ["Yu Darvish", 209.2, 145, 68, 66, 80, 277, 1.44444],
                    ["Cliff Lee", 222.2, 193, 77, 71, 32, 222, 1.75],
                    ["Max Scherzer", 214.1, 152, 73, 69, 56, 240, 7],
                    ["Adam Wainwright", 241.2, 223, 83, 79, 35, 219, 2.11111],
                    ["Stephen Strasburg", 183.0, 136, 71, 61, 56, 191, 0.888889],
                    ["Hyun-Jin Ryu", 192.0, 182, 67, 64, 49, 154, 1.75],
                    ["Felix Hernandez", 204.1, 185, 74, 69, 46, 216, 1.2],
                    ["Shelby Miller", 173.1, 152, 65, 59, 57, 169, 1.66667],
                    ["Chris Sale", 214.1, 184, 81, 73, 46, 226, 0.785714],
                    ["Andrew Cashner", 175.0, 151, 68, 60, 47, 128, 1.11111],
                    ["Travis Wood", 200.0, 163, 73, 69, 66, 144, 0.75],
                    ["Kris Medlen", 197.0, 194, 77, 68, 47, 157, 1.25],
                    ["James Shields", 228.2, 215, 82, 80, 68, 196, 1.44444],
                    ["Mat Latos", 210.2, 197, 82, 74, 58, 187, 2],
                    ["Julio Teheran", 185.2, 173, 69, 66, 45, 170, 1.75],
                    ["Mike Minor", 204.2, 177, 79, 73, 46, 181, 1.44444],
                    ["Ervin Santana", 211.0, 190, 85, 76, 51, 161, 0.9],
                    ["Jordan Zimmermann", 213.1, 192, 81, 77, 40, 161, 2.11111],
                    ["A.J. Burnett", 191.0, 165, 79, 70, 67, 209, 0.909091],
                    ["Ubaldo Jimenez", 182.2, 163, 75, 67, 80, 194, 1.44444],
                    ["Hiroki Kuroda", 201.1, 191, 79, 74, 43, 150, 0.846154],
                    ["David Price", 186.2, 178, 78, 69, 27, 151, 1.25],
                    ["Kyle Lohse", 198.2, 196, 78, 74, 36, 125, 1.1],
                    ["Gio Gonzalez", 195.2, 169, 79, 73, 76, 192, 1.375],
                    ["Mike Leake", 192.1, 193, 78, 72, 48, 122, 2],
                    ["C.J. Wilson", 212.1, 200, 93, 80, 85, 188, 2.42857],
                    ["Patrick Corbin", 208.1, 189, 81, 79, 54, 178, 1.75],
                    ["Derek Holland", 213.0, 210, 90, 81, 64, 189, 1.11111],
                    ["Justin Masterson", 193.0, 156, 75, 74, 76, 195, 1.4],
                    ["Justin Verlander", 218.1, 212, 94, 84, 75, 217, 1.08333],
                    ["Jhoulys Chacin", 197.1, 188, 82, 76, 61, 126, 1.4],
                    ["Homer Bailey", 209.0, 181, 85, 81, 54, 199, 0.916667],
                    ["Jorge De La Rosa", 167.2, 170, 70, 65, 62, 112, 2.66667],
                    ["Jose Quintana", 200.0, 188, 83, 78, 56, 164, 1.28571],
                    ["Jeff Locke", 166.1, 146, 69, 65, 84, 125, 1.42857],
                    ["John Lackey", 189.1, 179, 80, 74, 40, 161, 0.769231],
                    ["Wade Miley", 202.2, 201, 88, 80, 66, 147, 1],
                    ["Cole Hamels", 220.0, 205, 94, 88, 50, 202, 0.571429],
                    ["Dillon Gee", 199.0, 208, 84, 80, 47, 142, 1.09091],
                    ["Doug Fister", 208.2, 229, 91, 85, 44, 159, 1.55556],
                    ["Ricky Nolasco", 199.1, 195, 90, 82, 46, 165, 1.18182],
                    ["Chris Tillman", 206.1, 184, 87, 85, 68, 179, 2.28571],
                    ["Andy Pettitte", 185.1, 198, 85, 77, 48, 128, 1],
                    ["Jon Lester", 213.1, 209, 94, 89, 67, 177, 1.875],
                    ["Miguel Gonzalez", 171.1, 157, 81, 72, 53, 120, 1.375],
                    ["Bronson Arroyo", 202.0, 199, 88, 85, 34, 124, 1.16667],
                    ["A.J. Griffin", 200.0, 171, 91, 85, 54, 171, 1.4],
                    ["Scott Feldman", 181.2, 159, 87, 78, 56, 132, 1],
                    ["Eric Stults", 203.2, 219, 97, 89, 40, 131, 0.846154],
                    ["Lance Lynn", 201.2, 189, 92, 89, 76, 198, 1.5],
                    ["Jarrod Parker", 197.0, 178, 92, 87, 63, 134, 1.5],
                    ["Matt Cain", 184.1, 158, 85, 82, 55, 158, 0.8],
                    ["Jeremy Guthrie", 211.2, 236, 99, 95, 59, 111, 1.25],
                    ["Mark Buehrle", 203.2, 223, 100, 94, 51, 139, 1.2],
                    ["Kevin Correia", 185.1, 218, 89, 86, 45, 101, 0.692308],
                    ["Bud Norris", 176.2, 196, 89, 82, 67, 147, 0.833333],
                    ["Yovani Gallardo", 180.2, 180, 92, 84, 66, 144, 1.2],
                    ["R.A. Dickey", 224.2, 207, 113, 105, 71, 177, 1.07692],
                    ["Rick Porcello", 177.0, 185, 87, 85, 42, 142, 1.625],
                    ["Felix Doubront", 162.1, 161, 84, 78, 71, 139, 1.83333],
                    ["Jeff Samardzija", 213.2, 210, 109, 103, 78, 214, 0.615385],
                    ["Wily Peralta", 183.1, 187, 107, 89, 73, 129, 0.733333],
                    ["Tim Lincecum", 197.2, 184, 102, 96, 76, 193, 0.714286],
                    ["Ryan Dempster", 171.1, 170, 97, 87, 79, 157, 0.888889],
                    ["Jerome Williams", 169.1, 181, 93, 86, 55, 107, 0.9],
                    ["Dan Haren", 169.2, 179, 92, 88, 31, 151, 0.714286],
                    ["Kyle Kendrick", 182.0, 207, 104, 95, 47, 110, 0.769231],
                    ["CC Sabathia", 211.0, 224, 122, 112, 65, 175, 1.07692],
                    ["Ian Kennedy", 181.1, 180, 108, 99, 73, 163, 0.7],
                    ["Edwin Jackson", 175.1, 197, 110, 97, 59, 135, 0.444444],
                    ["Jeremy Hellickson", 174.0, 185, 103, 100, 50, 135, 1.2],
                    ["Joe Saunders", 183.0, 232, 117, 107, 61, 107, 0.6875],
                ],
                columns: [
                    "Name",
                    "Innings Pitched",
                    "Hits",
                    "Runs",
                    "Earned Runs",
                    "Walks",
                    "Strikeouts",
                    "Win/Loss",
                ],
                title: "2013 Major League Baseball Pitching Stats"
            }
        }
    });
    
    function dataTableBehavior() {
        /* Set the defaults for DataTables initialization */
        JQ.extend(true, JQ.fn.dataTable.defaults, {
            sDom: "<'dt-top'Wlfr>" +
                 "<'table-wrapper't><'dt-bottom'ip>",
            fnInitComplete: function (table) {
                JQ('.dataTables_length').find("select").addClass("col-md-2");
                JQ('.dataTables_filter').find(":input")
                    .addClass("input-small search-query")
                    .attr("placeholder", "Search");
                JQ('.dataTables_length > label').contents().filter(function() {
                    return this.nodeType != 1;
                }).wrap("<span class='mini help-inline'>");
            },
            sPaginationType: "bootstrap",
            oLanguage: {
                sLengthMenu: "_MENU_ records per page",
                sInfo: "<b>_START_-_END_</b> of <b>_TOTAL_</b> entries",
                sSearch: ""
            }
        });


        /* Default class modification */
        JQ.extend(JQ.fn.dataTableExt.oStdClasses, {
            sWrapper: "dataTables_wrapper form-inline",
            sInfo: "mini muted dt-info"
        });

        /* API method to get paging information */
        JQ.fn.dataTableExt.oApi.fnPagingInfo = function (opts) {
            return {
                iStart:         opts._iDisplayStart,
                iEnd:           opts.fnDisplayEnd(),
                iLength:        opts._iDisplayLength,
                iTotal:         opts.fnRecordsTotal(),
                iFilteredTotal: opts.fnRecordsDisplay(),
                iPage:
                    Math.ceil(opts._iDisplayStart / opts._iDisplayLength),
                iTotalPages:
                    Math.ceil(opts.fnRecordsDisplay() / opts._iDisplayLength)
            };
        };


        /* Bootstrap style pagination control */
        JQ.extend(JQ.fn.dataTableExt.oPagination, {
            bootstrap: {
                fnInit: function (opts, nPaging, fnDraw) {
                    var oLang = opts.oLanguage.oPaginate;
                    var fnClickHandler = function (e) {
                        e.preventDefault();
                        if (opts.oApi._fnPageChange(opts, e.data.action)) {
                            fnDraw(opts);
                        }
                    };
                    JQ(nPaging).addClass('pagination pagination-mini').append(_.template(
                        '<ul>' +
                            '<li class="prev disabled">' +
                            '<a href="#">&larr;</a></li>'+
                            '<li class="next disabled">'+
                            '<a href="#">&rarr;</a></li>'+
                        '</ul>', { prev: oLang.sPrevious, next: oLang.sNext })
                    );
                    var els = JQ('a', nPaging);
                    JQ(els[0]).bind('click.DT',
                        { action: "previous" }, fnClickHandler);
                    JQ(els[1]).bind('click.DT',
                        { action: "next" }, fnClickHandler);
                },
                fnUpdate: function (opts, fnDraw) {
                    var iListLength = 5;
                    var oPaging = opts.oInstance.fnPagingInfo();
                    var an = opts.aanFeatures.p;
                    var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

                    if ( oPaging.iTotalPages < iListLength) {
                        iStart = 1;
                        iEnd = oPaging.iTotalPages;
                    }
                    else if (oPaging.iPage <= iHalf) {
                        iStart = 1;
                        iEnd = iListLength;
                    } else if (oPaging.iPage >= (oPaging.iTotalPages-iHalf)) {
                        iStart = oPaging.iTotalPages - iListLength + 1;
                        iEnd = oPaging.iTotalPages;
                    } else {
                        iStart = oPaging.iPage - iHalf + 1;
                        iEnd = iStart + iListLength - 1;
                    }

                    for (i=0, iLen=an.length ; i<iLen ; i++) {
                        // Remove the middle elements
                        JQ('li:gt(0)', an[i]).filter(':not(:last)').remove();

                        // Add the new list items and their event handlers
                        for (j=iStart ;j<=iEnd ;j++) {
                            sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                            JQ('<li '+sClass+'><a href="#">'+j+'</a></li>')
                                .insertBefore(JQ('li:last', an[i])[0])
                                .bind('click', function (e) {
                                    e.preventDefault();
                                    opts._iDisplayStart = (parseInt(JQ('a', this).text(),10)-1) * oPaging.iLength;
                                    fnDraw(opts);
                                } );
                        }

                        // Add / remove disabled classes from the static elements
                        if (oPaging.iPage === 0) {
                            JQ('li:first', an[i]).addClass('disabled');
                        } else {
                            JQ('li:first', an[i]).removeClass('disabled');
                        }

                        if (oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0) {
                            JQ('li:last', an[i]).addClass('disabled');
                        } else {
                            JQ('li:last', an[i]).removeClass('disabled');
                        }
                    }
                }
            }
        });


        /*
         * TableTools Bootstrap compatibility
         * Required TableTools 2.1+
         */
        if (JQ.fn.DataTable.TableTools) {
            // Set the classes that TableTools uses to something suitable for Bootstrap
            JQ.extend(true, JQ.fn.DataTable.TableTools.classes, {
                container: "DTTT btn-group",
                buttons: {
                    normal: "btn",
                    disabled: "disabled"
                },
                collection: {
                    container: "DTTT_dropdown dropdown-menu",
                    buttons: {
                        normal: "",
                        disabled: "disabled"
                    }
                },
                print: {
                    info: "DTTT_print_info modal"
                },
                select: {
                    row: "active"
                }
            });

            // Have the collection use a bootstrap compatible dropdown
            JQ.extend(true, JQ.fn.DataTable.TableTools.DEFAULTS.oTags, {
                collection: {
                    container: "ul",
                    button: "li",
                    liner: "a"
                }
            });
        }
    }
    
    iris.Renderer.register("Table", Table);
    return Table;
});