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
			if (typeof options.set !== 'undefined') {
				options.set.call(this, value);
			}
			_this.onvalue.trigger(value);
		}
	});

	this.onvalue = new nx.Event();
};

nx.Property.prototype.bind = function(target, mode, sConversion, tConversion) {
	new nx.Binding(
		this,
		target,
		mode,
		sTransform,
		tTransform
	);
};
