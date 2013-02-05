'use strict';

window.nx = window.nx || {}

window.nx.Property = function() {
	var _value;

	Object.defineProperty(this, 'value', {
		enumerable : true,
		get: function() { return _value; },
		set: function(value) { _value = value; }
	});
}