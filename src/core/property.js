window.nx = window.nx || {};

nx.Property = function(options) {
	options = options || {};

	if (typeof options.value !== 'undefined') {
		this._value = options.value;
	}

	this.onvalue = new nx.Event();
};

Object.defineProperty(nx.Property.prototype, 'value', {
	enumerable : true,
	get: function() { return this._value; },
	set: function(value) {
		this._value = value;
		this.onvalue.trigger(value);
	}
});

nx.Property.prototype.bind = function(target, mode, sourceConversion, targetConversion) {
	return new nx.Binding(
		this,
		target,
		mode,
		sourceConversion,
		targetConversion
	);
};

nx.Property.prototype.set = function(value) {
	this._value = value;
};
