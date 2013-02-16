'use strict';

window.nx = window.nx || {};

nx.Binding = function(source, target, mode, sourceConversion, targetConversion) {
	var _this = this;
	targetConversion = targetConversion || sourceConversion; // for <- mode
	this.mode = mode;
	this.locked = false;
	if (mode !== '<-') { // -> or <->
		source.onvalue.add(function(value) {
			_this.sync(target, value, sourceConversion);
		});
	}
	if (mode !== '->') { // <- or <->
		target.onvalue.add(function(value) {
			_this.sync(source, value, targetConversion);
		});
	}
};

nx.Binding.prototype.sync = function(recipient, value, conversion) {
	if (this.mode === '<->') {
		if (this.locked) {
			this.locked = false;
			return;
		} else {
			this.locked = true;
		}
	}
	if (typeof conversion !== 'undefined') {
		if (conversion instanceof nx.Mapping) {
			value = conversion.map(value, recipient.value);
		} else if (typeof conversion === 'function') {
			recipient.value = conversion(value);
		}
	} else {
		recipient.value = value;
	}
};
