define(['jquery', 'underscore', 'jquery.dataTables', 'columnfilter'],
    function ($, _) {
    var defaults = {
        scrollY: 300,
        element: "body",
        rowCallback: function () {}
    };
    function Table(options) {
        var self = this;
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        var filterExclude = [];
        var $element = $(options.element);
        var elementOffset = $element.offset();
        self.setData = function (data) {
            self.data = data;
            data.filter = data.filter || [];
            for (var i = 0; i < data.columns.length; i++) {
                if (!_.contains(data.filter, data.columns[i])) {
                    filterExclude.push(i);
                }
            }
        };
        self.render = function () {
            var $table = $("<table>").attr("cellpadding", 0)
                .attr("cellspacing",0).attr("border", 0)
                .addClass('table table-striped table-bordered');
            $element.empty().append($table);
            var cols = _.map(self.data.columns, function (d) {
                return { sTitle: d };
            })
            $table.dataTable({
                sInfo: "muted",
                aaData: self.data.data,
                aoColumns: cols,
        		sPaginationType: "bootstrap",
                sScrollY: options.scrollY,
                bPaginate: false,
        		oLanguage: {
        			sLengthMenu: "_MENU_ per page",
                    sInfoThousands: ","
        		},
                oColumnFilterWidgets: {
                    aiExclude: filterExclude,
                    bGroupTerms: true
                },
                fnRowCallback: function (tr, data) {
                    options.rowCallback.call(tr, data);
                }
            });
            adjustHeight('.dataTables_wrapper');
            adjustHeight('.table-wrapper');
            $(".column-filter-widget").find("select").addClass("mini");
            $element.offset({
                top: elementOffset.top, left: elementOffset.left
            });
            // $(".dataTable .sorting_asc").each(function () {
            //     $(this).html(
            //         $(this).html() + "<i class=\"glyphicon-chevron-up\"></i>");
            // });
            // $(".dataTable .sorting_desc").each(function () {
            //     $(this).html(
            //         $(this).html() + "<i class=\"glyphicon-chevron-down\"></i>");
            // });
            
        };
        function adjustHeight(selector) {
            $(selector).each(function () {
                var w = $(this);
                var p = w.parent();
                var totalHeight = 0;
                p.children().each(function () {
                    totalHeight += $(this).outerHeight(true)
                });
                w.height(p.height() + w.outerHeight(true) - totalHeight);
            });
        }
    }
    /* Set the defaults for DataTables initialization */
    $.extend(true, $.fn.dataTable.defaults, {
    	sDom: "<'dt-top row'<'span6'Wl><'span6'fr>>" +
             "<'table-wrapper't><'dt-bottom'ip>",
        fnInitComplete: function (table) {
            $('.dataTables_length').find("select").addClass("span2");
            $('.dataTables_filter').find(":input")
                .addClass("input-small search-query")
                .attr("placeholder", "Search");
            $('.dataTables_length > label').contents().filter(function() {
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
    $.extend($.fn.dataTableExt.oStdClasses, {
    	sWrapper: "dataTables_wrapper form-inline",
        sInfo: "mini muted dt-info"
    });

    /* API method to get paging information */
    $.fn.dataTableExt.oApi.fnPagingInfo = function (opts) {
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
    $.extend($.fn.dataTableExt.oPagination, {
    	bootstrap: {
    		fnInit: function (opts, nPaging, fnDraw) {
    			var oLang = opts.oLanguage.oPaginate;
    			var fnClickHandler = function (e) {
    				e.preventDefault();
    				if (opts.oApi._fnPageChange(opts, e.data.action)) {
    					fnDraw(opts);
    				}
    			};
    			$(nPaging).addClass('pagination pagination-mini').append(_.template(
    				'<ul>' +
                        '<li class="prev disabled">' +
                        '<a href="#">&larr;</a></li>'+
    					'<li class="next disabled">'+
                        '<a href="#">&rarr;</a></li>'+
    				'</ul>', { prev: oLang.sPrevious, next: oLang.sNext })
    			);
    			var els = $('a', nPaging);
    			$(els[0]).bind('click.DT',
                    { action: "previous" }, fnClickHandler);
    			$(els[1]).bind('click.DT',
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
    				$('li:gt(0)', an[i]).filter(':not(:last)').remove();

    				// Add the new list items and their event handlers
    				for (j=iStart ;j<=iEnd ;j++) {
    					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
    					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
    						.insertBefore($('li:last', an[i])[0])
    						.bind('click', function (e) {
    							e.preventDefault();
    							opts._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
    							fnDraw(opts);
    						} );
    				}

    				// Add / remove disabled classes from the static elements
    				if (oPaging.iPage === 0) {
    					$('li:first', an[i]).addClass('disabled');
    				} else {
    					$('li:first', an[i]).removeClass('disabled');
    				}

    				if (oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0) {
    					$('li:last', an[i]).addClass('disabled');
    				} else {
    					$('li:last', an[i]).removeClass('disabled');
    				}
    			}
    		}
    	}
    });


    /*
     * TableTools Bootstrap compatibility
     * Required TableTools 2.1+
     */
    if ($.fn.DataTable.TableTools) {
    	// Set the classes that TableTools uses to something suitable for Bootstrap
    	$.extend(true, $.fn.DataTable.TableTools.classes, {
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
    	$.extend(true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
    		collection: {
    			container: "ul",
    			button: "li",
    			liner: "a"
    		}
    	});
    }

    return Table;
});