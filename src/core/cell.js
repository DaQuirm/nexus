window.nx = window.nx || {};

nx.Cell = function(options) {
	options = options || {};

	if (typeof options.value !== 'undefined') {
		this._value = options.value;
	}

	this._bindingIndex = 0;
	this.bindings = {};

	this.onvalue = new nx.Event();
	this.onsync = new nx.Event();

	if (typeof options.action !== 'undefined') {
		this.onvalue.add(options.action);
	}
};

Object.defineProperty(nx.Cell.prototype, 'value', {
	enumerable : true,
	get: function () { return this._value; },
	set: function (value) {
		this._value = value;
		this.onvalue.trigger(value);
		for (var index in this.bindings) {
			this.bindings[index].sync();
		}
	}
});

nx.Cell.prototype._createBinding = function (cell, conversion) {
	var binding = new nx.Binding(this, cell, conversion);
	binding.index = this._bindingIndex;
	this.bindings[this._bindingIndex++] = binding;
	return binding;
};

nx.Cell.prototype['->'] = function (cell, conversion) {
	var binding = this._createBinding(cell, conversion);
	binding.sync();
	return binding;
};

nx.Cell.prototype['<-'] = function (cell, conversion) {
	return cell['->'](this, conversion);
};

nx.Cell.prototype['<->'] = function (cell, conversion, backConversion) {
	if (conversion instanceof nx.Mapping) {
		backConversion = backConversion || conversion.inverse();
	}
	var binding = this._createBinding(cell, conversion);
	var backBinding = cell._createBinding(this, backConversion);
	binding.pair(backBinding);
	binding.sync();
	return [binding, backBinding];
};

nx.Cell.prototype.bind = function(cell, mode, conversion, backConversion) {
	this[mode](cell, conversion, backConversion);
};

nx.Cell.prototype.set = function(value) {
	this._value = value;
};
