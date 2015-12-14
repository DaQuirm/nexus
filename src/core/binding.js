var nx = {
	Mapping: require('./mapping')
};

nx.Binding = function (source, target, conversion) {
	this.source = source;
	this.target = target;
	this.locked = false;
	this.conversion = conversion;
};

nx.Binding.prototype.convert = function (value, oldValue) {
	if (typeof this.conversion !== 'undefined') {
		if (this.conversion instanceof nx.Mapping) {
			return this.conversion.map(value, this.target.value);
		} else if (typeof this.conversion === 'function') {
			return this.conversion(value, oldValue);
		}
	} else {
		return value;
	}
};

nx.Binding.prototype.sync = function (value, oldValue) {
	if (this.locked) {
		return;
	}
	var targets;
	if (typeof this.target === 'function') {
		targets = this.target(value, oldValue);
		if (Array.isArray(targets)) {
			targets.forEach(function (target) {
				target.value = this.convert(value, oldValue);
			}, this);
		} else {
			targets.value = this.convert(value, oldValue);
		}
	} else {
		this.target.value = this.convert(value, oldValue);
	}
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
