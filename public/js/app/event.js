define(function () {
    var EventCallbacks;
    var eventSplitter = /\s+/;
	return {
		// Bind one or more space separated events, `events`, to a `callback`
		// function. Passing `"all"` will bind the callback to all events fired.
		on: function (events, callback, context) {

			var event, node, tail, list;
			if (!callback) return this;
			if (!EventCallbacks) EventCallbacks = {};
			events = events.split(eventSplitter);

			// Create an immutable callback list, allowing traversal during
			// modification. The tail is an empty object that will always be
			// used as the next node.
			while (event = events.shift()) {
				list = EventCallbacks[event];
				node = list ? list.tail : {};
				node.next = tail = {};
				node.context = context;
				node.callback = callback;
				EventCallbacks[event] = {
					tail: tail,
					next: list ? list.next : node
				};
			}

			return this;
		},

		// Remove one or many callbacks. If `context` is null, removes all
		// callbacks with that function. If `callback` is null, removes all
		// callbacks for the event. If `events` is null, removes all bound
		// callbacks for all events.
		off: function (events, callback, context) {
			var event, node, tail, cb, ctx;

			// No events, or removing *all* events.
			if (!EventCallbacks) return;
			if (!(events || callback || context)) {
				delete EventCallbacks;
				return this;
			}

			// Loop through the listed events and contexts, splicing them
			// out of the linked list of callbacks if appropriate.
			events = events
				? events.split(eventSplitter)
				: Iris.keys(EventCallbacks);
			while (event = events.shift()) {
				node = calls[event];
				delete calls[event];
				if (!node || !(callback || context)) continue;
				// Create a new list, omitting the indicated callbacks.
				tail = node.tail;
				while ((node = node.next) !== tail) {
					cb = node.callback;
					ctx = node.context;
					if ((callback && cb !== callback) ||
						(context && ctx !== context)) {
						this.on(event, cb, ctx);
					}
				}
			}

			return this;
		},

		// Trigger one or many events, firing all bound callbacks. Callbacks
		// are passed the same arguments as `trigger` is, apart from the
		// event name (unless you're listening on `"all"`, which will cause
		// your callback to receive the true name of the event as the first
		// argument).
		trigger: function (events) {
			var event, node, calls, tail, args, all, rest;
			if (!EventCallbacks) return this;
			all = EventCallbacks.all;
			events = events.split(eventSplitter);
			rest = Array.prototype.slice.call(arguments, 1);

			// For each event, walk through the linked list of callbacks
			// twice, first to trigger the event, then to trigger any
			// `"all"` callbacks.
			while (event = events.shift()) {
				if (node = EventCallbacks[event]) {
					tail = node.tail;
					while ((node = node.next) !== tail) {
						node.callback.apply(node.context || this, rest);
					}
				}
				if (node = all) {
					tail = node.tail;
					args = [event].concat(rest);
					while ((node = node.next) !== tail) {
						node.callback.apply(node.context || this, args);
					}
				}
			}

			return this;
		}
	};
});
