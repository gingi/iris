var delay = 2000;
var delay2 = 5000;
var delay3 = 500;
var aWatch;
var aWatchTally;
var spinner;
var requestStatus = new Object();
var requestTimeout = new Object();
var activeRequests = 0;
var errors = 0;
var nothingToSee = "none";
jQuery(document).ready(function ($) {
	spinner = $(".ajaxSpinner");
	aWatch = $(".ajaxWatch");
	aWatchTally = $(".ajaxWatchTally");
	aWatch.popover({placement:'bottom', content: statusReport });
	aWatch.ajaxStart(function() {
		requestStatus = {};
		requestTimeout = {};
		activeRequests = 0;
		errors = 0;
		aWatchTally.show();
		spinner.spin({ lines: 8, length: 2, width: 2, radius: 3, left: -20 });
	});
	aWatch.ajaxSend(function(e, jqxhr, settings) {
		if (activeRequests === 0) {
			spinner.spin({ lines: 8, length: 2, width: 2, radius: 3, left: -20 });
		}
		activeRequests++;
		aWatchTally.html("loading "+activeRequests);
		requestStatus[settings.url] = "sent";
		requestTimeout[settings.url] = window.setTimeout(statusReport,delay);
	});
	aWatch.ajaxError(function(e, jqxhr, settings) {
		activeRequests--;
		errors++;
		requestStatus[settings.url] = "error";
		window.clearTimeout(requestTimeout[settings.url]);
		statusReport();
	});
	aWatch.ajaxComplete(function(e, jqxhr, settings) {
		activeRequests--;
//		aWatch.html("running "+activeRequests);
		requestStatus[settings.url] = "done";
		window.clearTimeout(requestTimeout[settings.url]);
	});
	aWatch.ajaxStop(function() {
		statusReport();
		spinner.spin(false);
		if (errors > 0) {
			aWatchTally.html("error "+errors);
		} else {
			aWatchTally.html("ready");
			var resetTimout = window.setTimeout(function(){aWatchTally.hide()},delay3);
		}
		var cleanupTimout = window.setTimeout(function() {
			cleanup();
			statusReport();
			aWatch.innerText = activeRequests;
		},delay2);
	});
	function cleanup() {
		for (var req in requestStatus) {
			if (requestStatus[req] === "done") {
				delete requestStatus[req];
			}
		}
	}
	function statusReport() {
		var display = 'hide';
		var div = $(document.createElement('div'));
		var n = 0;
		for (var req in requestStatus) {
			n++;
			var span = $(document.createElement('p'));
			div.append(span);
			span.append("<b>" + requestStatus[req] + "</b> " + req);
			switch (requestStatus[req]) {
				case "sent":
					display = 'show';
					break;
				case "error":
					display = 'show';
					break;
				case "done":
				default:
			}
		}
		if (n>0) {
			aWatch.data('popover').options.content = div.html();
		} else {
			aWatch.data('popover').options.content = nothingToSee;
		}
		aWatch.popover(display);
	}
});


