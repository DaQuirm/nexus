'use strict';

window.nx = window.nx || {};

nx.Binding = function(source, target, mode, sourceConversion, targetConversion) {
	var _this = this;
	this.mode = mode;
	this.locked = false;
	if (mode !== '<-') { // -> or <->
		source.onvalue.add(function(value) {
			if (_this.mode === '<->') {
				if (_this.locked) {
					_this.locked = false;
					return;
				} else {
					_this.locked = true;
				}
			}
			target.value = value;
		});
	}
	if (mode !== '->') { // <- or <->
		target.onvalue.add(function(value) {
			if (_this.mode === '<->') {
				if (_this.locked) {
					_this.locked = false;
					return;
				} else {
					_this.locked = true;
				}
			}
			source.value = value;
		});
	}
};