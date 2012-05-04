var delay = 2000;
var aWatch;
var requestStatus = new Object();
var requestTimeout = new Object();
$(function () {
	aWatch = $(".ajaxWatch");
	aWatch.popover({placement:'bottom', content: requestStatus});
	aWatch.ajaxStart(function() {
		requestStatus = {};
		requestTimeout = {};
		aWatch.spin("small");
	});
	aWatch.ajaxSend(function(e, jqxhr, settings) {
		requestStatus[settings.url] = "sent";
		requestTimeout[settings.url] = window.setTimeout(statusReport,delay);
	});
	$(".ajaxWatch").ajaxError(function(e, jqxhr, settings) {
		requestStatus[settings.url] = "error";
		window.clearTimeout(requestTimeout[settings.url]);
		statusReport();
	});
	$(".ajaxWatch").ajaxComplete(function(e, jqxhr, settings) {
		requestStatus[settings.url] = "done";
		window.clearTimeout(requestTimeout[settings.url]);
	});
	$(".ajaxWatch").ajaxStop(function() {
		statusReport();
		aWatch.spin(false);
		$(this).popover('hide');
	});
});

function statusReport() {
	var div = $(document.createElement('div'));
	var display = 'hide';
	for (var req in requestStatus) {
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
	aWatch.data('popover').options.content = div.html();
	aWatch.popover(display);
}