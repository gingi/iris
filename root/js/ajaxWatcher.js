var requests = new Object();
$(function () {
	$(".ajaxWatch").popover({placement:'bottom', content: requests});
	$(".ajaxWatch").ajaxStart(function() {
		console.log("started");
		$(this).popover('show');
	});
	$(".ajaxWatch").ajaxSend(function(e, jqxhr, settings) {
		console.log("sent", settings.url);
		requests[settings.url] = "sent";
		$(this).data('popover').options.content = requests;
		$(this).popover('show');
	});
	$(".ajaxWatch").ajaxComplete(function(e, jqxhr, settings) {
		console.log("completed",settings.url);
		requests[settings.url] = "done";
		$(this).data('popover').options.content = requests;
		$(this).popover('show');
	});
	$(".ajaxWatch").ajaxStop(function() {
		console.log("stopped",requests);
		$(this).popover('hide');
	});
});
