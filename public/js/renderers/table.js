define(["jquery", "underscore", "iris", "datatables", "columnfilter"],
    function (JQ, _, iris) {
    var Table = iris.Renderer.extend({
        defaults: {
            scrollY: 300,
            element: "body",
            rowCallback: function () {}
        },
        initialize: function () {
            this.filterExclude = [];
        },
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
        render: function (args) {
            var self = this;
            args = args ? _.clone(args) : {};
            var options = self.options;
            var $element = JQ(options.element);
            var elementOffset = $element.offset();
            var $table = JQ("<table>").addClass('table table-striped table-bordered');
            $element.empty().append($table);
            var cols = _.map(self.columns, function (d) {
                return { sTitle: d, type: "string" };
            });
            options.scrollY = Math.max($element.height()-100, options.scrollY);
            dataTableBehavior();
            $table.dataTable({
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
            var thead = $table.parent().prev().find("thead");
            var theadRow = thead.find("tr");
            var clone    = JQ("<tr>");
            theadRow.children().each(function () {
                clone.append(JQ(this).clone());
            });
            thead.append(clone);
            $table.columnFilter({
                sPlaceHolder: "head:after",
                aoColumns: _.map(cols, function (d) {
                    return { type: "text", bRegex: true }
                })
            });
            thead.find("input").addClass("form-control input-xs");

            thead.find("tr").filter(":last").children().each(function () {
                var attributes = this.attributes;
                var i = attributes.length;
                while (i--)
                    this.removeAttributeNode(attributes[i]);
            });

            $table.on("filter", function (event, tbl) {
                var filtered = _.map(tbl.aiDisplay, function (index) {
                    return self.data[index];
                });
                self.emit("table:filter", [ filtered ]);
            });
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