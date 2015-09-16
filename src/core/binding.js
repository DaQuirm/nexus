var nx = {
	Mapping: require('./mapping')
};

nx.Binding = function (source, target, conversion) {
	this.source = source;
	this.target = target;
	this.locked = false;
	this.conversion = conversion;
};

nx.Binding.prototype.sync = function () {
	if (this.locked) {
		return;
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
};

nx.Binding.prototype.pair = function (binding) {
	this.twin = binding;
	binding.twin = this;
};

nx.Binding.prototype.lock = function () {
	this.locked = true;
};

nx.Binding.prototype.unlock = function () {
	this.locked = false;
};

nx.Binding.prototype.unbind = function () {
	delete this.source.bindings[this.index];
};

module.exports = nx.Binding;
