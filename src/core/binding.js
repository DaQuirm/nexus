window.nx = window.nx || {};

nx.Binding = function (source, target, conversion) {
	var _this = this;

	this.source = source;
	this.target = target;

	this.conversion = conversion;
};

nx.Binding.prototype.sync = function () {
	if (typeof this.lock !== 'undefined') {
		if (this.lock.locked) {
			this.lock.locked = false;
			return;
		} else {
			this.lock.locked = true;
		}
	}

	var value = this.source.value;
	if (typeof this.conversion !== 'undefined') {
		if (this.conversion instanceof nx.Mapping) {
			value = this.conversion.map(value, this.target.value);
		} else if (typeof this.conversion === 'function') {
			value = this.conversion(value);
		}
	}
	this.target.value = value;
	this.target.onsync.trigger(value);
};

nx.Binding.prototype.pair = function (binding) {
	return this.lock = binding.lock = { locked: false };
};

nx.Binding.prototype.unbind = function () {
	delete this.source.bindings[this.index];
};
