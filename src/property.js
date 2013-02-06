'use strict';

window.nx = window.nx || {};

nx.Property = function(options) {
	var _value;
	options = options || {};
	this.bindings = {};
	this.bindingIndex = 0;

	Object.defineProperty(this, 'value', {
		enumerable : true,
		get: function() { return _value; },
		set: function(value) {
			_value = value;
			if (typeof options.set !== 'undefined') {
				options.set.call(this, value);
			}
			Object.keys(this.bindings).forEach(function(binding) {
				this.bindings.sync();
			});
		}
	});
};

nx.Property.prototype.bind = function(target, mode, sTransform, tTransform) {
	this.bindings[this.bindingIndex++] = new nx.Binding(
		bindingIndex,
		mode,
		sTransform,
		tTransform
	);
};
