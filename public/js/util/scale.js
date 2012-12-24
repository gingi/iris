define(function () {
	function Scale() {
        var self = this;
        var _domain = [0, 1];
        var _range  = [0, 1];
        self.domain = function (args) {
            if (args != null) {
                _domain[0] = args[0];
                _domain[1] = args[1];
            }
            return _domain;
        };
        self.range = function (args) {
            if (args != null) {
                _range[0] = args[0];
                _range[1] = args[1];
            }
            return _range;
        };
        self.toDomain = function (value) {
            return _domain[0]
                + (_domain[1] - _domain[0]) * value / (_range[1] - _range[0]);
        };
        self.toRange = function (value) {
            return _range[0]
                + (_range[1] - _range[0]) * value / (_domain[1] - _domain[0]);
        };
		return this;
	};
	return Scale;
});