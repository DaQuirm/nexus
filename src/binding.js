'use strict';

window.nx = window.nx || {};

nx.Binding = function(source, target, mode, sourceConversion, targetConversion) {
	var _this = this;
	this.mode = mode;
	this.locked = false;
	if (mode !== '<-') { // -> or <->
		source.onvalue.add(function(value) {
			_this.sync(target, value);
		});
	}
	if (mode !== '->') { // <- or <->
		target.onvalue.add(function(value) {
			_this.sync(source, value);
		});
	}
};

nx.Binding.prototype.sync = function(recipient, value) {
	if (this.mode === '<->') {
		if (this.locked) {
			this.locked = false;
			return;
		} else {
			this.locked = true;
		}
	}
	recipient.value = value;
};