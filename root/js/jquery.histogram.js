/**
 * jQuery.histogram - Histogram for jQuery
 * Written by Ong Tern Chow (ternchow DOT ong AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 25/04/2010
 *
 * @author Tern Chow, ONG
 * @version 0.2
 * 
 * Change log
 * ----------
 * 25/04/2010 - Start writting the lib.
 * 25/04/2010 - using span as bar.
 * 26/04/2010 - support dynamic series.
 *
 **/

var histogram_zIndex = 50;

jQuery.fn.histogram_v = function(params){
	try {
		var graph = '';
		var subject = params.subject ? params.subject : 'subject';
		var bars = params.bars;
        var title = this.attr("title");
        if (params.where) {
            // title += ' Where ' + params.where;
        }

		// Currently only have 12 colors. sorry. may be should allow custom bar color.
		var colors = new Array("#f58d81", "#fddb86", "#fdff6b", "#9dec27", "#29c537", "#a0fff8", "#85cdff", "#2b66ff", "#9d8cff", "#982cff", "#ff8ffa", "#ff0e82");
		// here is the custom color
		if(params.colors) {
			colors = params.colors;
		}

		// header/title
        // graph += "<div class=\"ui-widget-header\">" + this.attr("title") + "</div>";
        // graph += "<h2>" + title + "</h2>";
        // graph += "<div>&nbsp;</div>";

		graph += '<table class="histogram">';
        graph += '<thead>';
		graph += '<tr class="ui-state-default">';
		graph += '<th onclick="sortTable(this)">'+subject+'</th>';
 		if ( params.legend ) {
			if (params.showSubValue) {
				for (i in params.title) {
					graph += '<th onclick = "sortTable(this)" style="background: ' + colors[i] + ';"> &nbsp;' + params.title[i] + '&nbsp; </th>';
					if (params.showPercentage) {
						graph += '<td align="center">%</td>';
					}
				}
			}
			graph += '<th align="center" onclick="sortTable(this)">Total</th>';
		}
		graph += '<th>&nbsp;</th>';
        graph += '</thead>';
		graph += '</tr>';
		
		// do scaling
		var max = 0;
		var total = 0;
		for ( var bar in bars ) {
			var row_sum = 0;
			for (i in params.title) {
				row_sum += parseInt(bars[bar]['val'][i]);
			}
			max = max > row_sum ? max : row_sum;
			total += row_sum;
		}
		var temp_max = max;
		while (temp_max>13) {
			temp_max -= 1;
		}

        graph += '<tbody>';
		for ( var bar in bars ) {
			var width1 = parseInt(bars[bar]['val'][0]) * 20 * (temp_max/max);
			var width2 = parseInt(bars[bar]['val'][1]) * 20 * (temp_max/max);
			var row_sum = 0;
			for (i in params.title) {
				row_sum += parseInt(bars[bar]['val'][i]);
			}
			graph += '<tr><td style="background: white"> &nbsp;' + bars[bar]['name'] + '&nbsp; </td>';
			
	 		if (params.legend) {
				if (params.showSubValue) {
					for (i in params.title) {
						graph += '<td style="background: white" align="center"> &nbsp;' + bars[bar]['val'][i] + '&nbsp; </td>';
						if (params.showPercentage) {
							graph += '<td style="background: white" align="right"> &nbsp;' + (bars[bar]['val'][i] / row_sum * 100).toFixed(2) + '&nbsp; </td>';
						}
					}
				}
				graph += '<td style="background: white" align="center"> &nbsp;'+row_sum+'&nbsp; </td>';
			}
			
			graph += '<td style="background: white" valign="center">';
			
				graph += '<table cellspacing="0" cellpadding="0">';
				graph += '<tr><td>';
				for (i in params.title) {
					var width = parseInt(bars[bar]['val'][i]) * 20 * (temp_max/max);
					graph += '<span class="histogram-bar-v" style="width: ' + width + 'px; background: '+ colors[i]+';"></span>';
				}
				graph += '</td></tr>';
				graph += '</table>';
			
			graph += '</td>'
			graph += '</tr>';
		}
        graph += '</tbody>';
		graph += '</table>';
		this.append(graph).addClass("ui-widget-content");
//		this.draggable();
		this.css("display", "table").css("fontSize","0.8em");
		this.mousedown(function(){$(this).css("zIndex", ++histogram_zIndex )});
		return this;
	} catch (e) {
		alert(e.message);
	}
};

jQuery.fn.histogram = function(params) { 
	try{
		var graph = "";
		var bars = params.bars;
		var label = new Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","BB","CC","DD","EE","FF","GG","HH","II","JJ","KK","LL","MM","NN","OO","PP","QQ","RR","SS","TT","UU","VV","WW","XX","YY","ZZ");
		var labelIndex = 0;
		// Currently only have 12 colors. sorry. may be should allow custom bar color.
		var colors = new Array("#f58d81", "#fddb86", "#fdff6b", "#9dec27", "#29c537", "#a0fff8", "#85cdff", "#2b66ff", "#9d8cff", "#982cff", "#ff8ffa", "#ff0e82");
		// here is the custom color
		if(params.colors) {
			colors = params.colors;
		}

		// header/title
		graph += "<div class=\"ui-widget-header\">" + this.attr("title") + "</div>";
		graph += "<div>&nbsp;</div>";
		
		graph += '<table>';
		graph += '<tr><td valign="top" style="padding-left: 20px;">';
			// graph - start
			graph += '<div style="display: table-cell; border: 1px solid #AAA;">';
				// scale - start
				graph += '<div style="width: 20; display: table-cell; border-right: 1px solid #AAA; vertical-align: bottom;">';
		
					var scale = '';
					scale += '<div style="text-align: right; height: 20px; width: 30px; font-size: 0.7em;"> 0 </div>';
					scale += '<div style="text-align: right; height: 7px; width: 30px; font-size: 0.7em;">&nbsp;</div>';
					var max = 0;
					var total = 0;
					var scale_unit = 0;
					// check for max value
					for( bar in bars ) {
						var col_sum = 0;
						for ( i in params.title ) {
							col_sum += parseInt(bars[bar][i]);
						}
						max = max > col_sum ? max : col_sum;
						// sum up total
						total += col_sum;
					}
					// currently the graph will always have 10 + 1 units.
					// later can let user input the data.
					scale_unit = Math.round( max / 10 );
					
					for( var i=1; i<=11; i++) {
						scale = '<div style="text-align: right; height: 20px; width: 30px; font-size: 0.7em;"> '+(i*scale_unit)+' </div>' + scale;
					}
					scale = '<div style="text-align: right; height: 20px; width: 30px; font-size: 0.7em;">&nbsp;</div>' + scale;
					graph += scale;
				graph += '</div>';
				// scale - end
				
				// bar - start
				graph += '<div style="vertical-align: bottom; display: table-cell; ">';
		    		graph += '<table cellpadding="0" cellspacing="1" title="'+bar+'">';
		    		graph += '<tr>';
					for( bar in bars ) {
						// TODO currently each unit block is 20px.
						// later will let user insert the chart height.
						// the block_size = height / (10 or as value specified by user) 
//						var height = parseInt(bars[bar]) * 20 / scale_unit;
						
			    		graph += '<td valign="bottom">';
			    		graph += '<div class="histogram-bar-x"></div>';
						single_bar = '';
						for (i in params.title) {
							var height = parseInt(bars[bar][i]) * 20 / scale_unit;
				    		single_bar = '<div class="histogram-bar-h" style="height: ' + height + 'px; background: '+colors[i]+';"></div>' + single_bar;
						}
						graph += single_bar;
			    		graph += '</td>';
						
					}
					graph += '</tr>';
					graph += '<tr>';
					// subject
					for( bar in bars ) {
						graph += '<td style="border-top: 1px solid #999; font-size: 0.7em; height: 20px;" align="center">' + label[labelIndex] + '</td>';
						labelIndex++;
					}
					graph += '</tr>';
					graph += '</table>';
				graph += "</div>";
				// bar - end
			graph += '</div>';
			// graph - end
			
		graph += '</td>';
		graph += '<td valign="top" style=" padding-right: 20px;">';
		
		if (params.legend) {
			// agenda - start
			graph += '<div style="display: table-cell; padding-left: 30px; vertical-align: top;">';
			graph += '<table style="background:#999;" cellpadding="1" cellspacing="1" width="200">';
			graph += '<tr class="ui-state-default"><td> &nbsp;Label&nbsp; </td><td> &nbsp;Subject&nbsp; </td>';
			if (params.showSubValue) {
				for (i in params.title) {
					graph += '<td style="background: ' + colors[i] + ';"> &nbsp;' + params.title[i] + '&nbsp; </td>';
					if (params.showPercentage) {
						graph += '<td align="center">%</td>';
					}
				}
			}
			graph += '<td align="center">Total</td>';
			graph += '</tr>';
			labelIndex = 0;
			for (bar in bars) {
				graph += '<tr id="histogram_row_' + label[labelIndex] + '">';
				graph += '<td style="background: #FFF" align="center"> ' + label[labelIndex] + ' </td>';
				graph += '<td style="background: #FFF"> &nbsp;' + bar + '</td>';
				col_sum = 0;
				for (i in params.title) {
					col_sum += parseInt(bars[bar][i]);
				}
				if (params.showSubValue) {
					for (i in params.title) {
						graph += '<td style="background: #FFF" align="center"> &nbsp;' + bars[bar][i] + '&nbsp; </td>';
						if (params.showPercentage) {
							graph += '<td style="background: #FFF" align="right"> &nbsp;' + (parseInt(bars[bar][i]) / col_sum * 100).toFixed(2) + '&nbsp; </td>';
						}
					}
				}
				graph += '<td style="background: #FFF" align="center"> &nbsp;'+col_sum+'&nbsp; </td>';
				graph += '</tr>';
				labelIndex++;
			}
			graph += '</table>';
			graph += '</div>';
		// agenda - end
		}
		
		graph += '</td></tr>';
		graph += '</table>';
		this.append(graph).addClass("ui-widget-content");
//		this.draggable();
		this.css("display", "table").css("paddingBottom","20px").css("fontSize","0.8em");
		this.mousedown(function(){$(this).css("zIndex", ++histogram_zIndex )});
		
		return this;

	} catch(e){
		alert(e.message);
	}
	
};
