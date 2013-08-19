define(function () {
    /**
     * Map between two numerical coordinate systems.
     *
     * @module util
     * @class Scale
     * @constructor
     */
    function Scale() {
        var self = this;
        var _domain = [0, 1];
        var _range  = [0, 1];
        var _ratio  = 1;
        function sign(n) {
            return n > 0 ? 1 : n < 0 ? -1 : 0;
        }
        function resetRatio() {
            _ratio = (_range[1] - _range[0]) / (_domain[1] - _domain[0]);
        }
        /**
         * @method domain
         * @param {array} args A pair of start and end values for the domain
         * @return the domain array
         */
        self.domain = function (args) {
            if (args != null) {
                _domain[0] = args[0];
                _domain[1] = args[1];
                resetRatio();
            }
            return _domain;
        };
        self.range = function (args) {
            if (args != null) {
                _range[0] = args[0];
                _range[1] = args[1];
                resetRatio();
            }
            return _range;
        };
        self.toDomain = function (value) {
            return (_ratio > 0 ? _domain[0] : _domain[1]) + value / _ratio;
        };
        self.toRange = function (value) {
            return _range[0] + value * _ratio;
        };
		return this;
	};
	return Scale;
});