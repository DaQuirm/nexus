'use strict';

window.nx = window.nx || {};

nx.Binding = function(source, target, mode, sourceConversion, targetConversion) {
	var _this = this;
	if (mode !== '<-') { // -> or <->
		source.onvalue.add(function(value) {
			target.value = value;
		});
	}
	if (mode !== '->') { // <- or <->
		target.onvalue.add(function(value) {
			source.value = value;
		});
	}
};