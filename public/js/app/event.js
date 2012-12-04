define( function () {
	function Observable() {
		this.listeners = [];
	}
	Observable.prototype = {
		constructor: Observable,
		observe: function( fn ) {
			this.listeners.push( fn );
		},

		unobserve: function( fn ) {
			var index;
			index = this.listeners.indexOf( fn );
			if( index > -1 ) {
				this.listeners.splice( index, 1 );
			}
		},

		update: function() {
			var listeners = this.listeners,
				len = listeners.length,
				i;
			for( i = 0; i < len; ++i ) {
				listeners[i].apply( null, arguments );
			}
		}
	};
	return Observable;
});