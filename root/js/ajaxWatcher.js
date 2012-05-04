var delay = 2000;
var delay2 = 5000;
var nothingToSee = "none";
var aWatch;
var requestStatus = new Object();
var requestTimeout = new Object();
$(function () {
	aWatch = $(".ajaxWatch");
	aWatch.popover({placement:'bottom', content: statusReport });
	aWatch.ajaxStart(function() {
		requestStatus = {};
		requestTimeout = {};
		aWatch.spin("small");
	});
	aWatch.ajaxSend(function(e, jqxhr, settings) {
		requestStatus[settings.url] = "sent";
		requestTimeout[settings.url] = window.setTimeout(statusReport,delay);
	});
	aWatch.ajaxError(function(e, jqxhr, settings) {
		requestStatus[settings.url] = "error";
		window.clearTimeout(requestTimeout[settings.url]);
		statusReport();
	});
	aWatch.ajaxComplete(function(e, jqxhr, settings) {
		requestStatus[settings.url] = "done";
		window.clearTimeout(requestTimeout[settings.url]);
	});
	aWatch.ajaxStop(function() {
		statusReport();
		aWatch.spin(false);
		var cleanupTimout = window.setTimeout(function() {
			cleanup();
			statusReport();
		},delay2);
	});
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