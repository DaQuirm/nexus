'use strict';

window.nx = window.nx || {};

nx.Property = function(options) {
	var _this = this;
	var _value;
	options = options || {};

	Object.defineProperty(this, 'value', {
		enumerable : true,
		get: function() { return _value; },
		set: function(value) {
			_value = value;
			_this.onvalue.trigger(value);
		}
	});

	this.onvalue = new nx.Event();
};

nx.Property.prototype.bind = function(target, mode, sourceConversion, targetConversion) {
	return new nx.Binding(
		this,
		target,
		mode,
		sourceConversion,
		targetConversion
	);
};
