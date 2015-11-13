var nx = {
	Binding: require('./binding'),
	Event:   require('./event'),
	Mapping: require('./mapping')
};

nx.Cell = function (options) {
	options = options || {};

	if (typeof options.value !== 'undefined') {
		this._value = options.value;
	}

	this._bindingIndex = 0;
	this.bindings = {};

	this.onvalue = new nx.Event();
	if (typeof options.action !== 'undefined') {
		this.onvalue.add(options.action);
	}

	['->', '<-', '<<-', '->>', '<->'].forEach(function (method) {
		if (typeof options[method] !== 'undefined') {
			this[method].apply(this, options[method]);
		}
	}, this);
};

Object.defineProperty(nx.Cell.prototype, 'value', {
	enumerable : true,
	get: function () { return this._value; },
	set: function (value) {
		this._value = value;
		this.onvalue.trigger(value);
		for (var index in this.bindings) {
			var binding = this.bindings[index];
			var hasTwin = typeof binding.twin !== 'undefined';
			if (hasTwin) {
				binding.twin.lock();
			}
			binding.sync();
			if (hasTwin) {
				binding.twin.unlock();
			}
		}
	}
});

nx.Cell.prototype._createBinding = function (cell, conversion) {
	var binding = new nx.Binding(this, cell, conversion);
	binding.index = this._bindingIndex;
	this.bindings[this._bindingIndex++] = binding;
	return binding;
};

nx.Cell.prototype['->'] = function (cell, conversion, sync) {
	var binding = this._createBinding(cell, conversion);
	if (sync) {
		binding.sync();
	}
	return binding;
};

nx.Cell.prototype['<-'] = function (arg, conversion, sync) {
	var values;
	var _this = this;
	if (Array.isArray(arg)) {
		values = new Array(arg.length);
		return arg.map(function (cell, index) {
			values[index] = cell.value;
			return cell['->'](_this, function (value) {
				values[index] = value;
				return conversion.apply(null, values);
			}, sync);
		});
	}
	return arg['->'](this, conversion, sync);
};

nx.Cell.prototype['->>'] = function (cell, conversion) {
	return this['->'](cell, conversion, true);
};

nx.Cell.prototype['<<-'] = function (cell, conversion) {
	return this['<-'](cell, conversion, true);
};

nx.Cell.prototype['<->'] = function (cell, conversion, backConversion, sync) {
	if (conversion instanceof nx.Mapping) {
		backConversion = backConversion || conversion.inverse();
	}
	var binding = this._createBinding(cell, conversion);
	var backBinding = cell._createBinding(this, backConversion);
	binding.pair(backBinding);
	if (sync === '->') {
		binding.sync();
	} else if (sync === '<-') {
		backBinding.sync();
	}
	return [binding, backBinding];
};

nx.Cell.prototype['<->>'] = function (cell, conversion, backConversion) {
	this['<->'](cell, conversion, backConversion, '->');
};

nx.Cell.prototype['<<->'] = function (cell, conversion, backConversion) {
	this['<->'](cell, conversion, backConversion, '<-');
};

nx.Cell.prototype.bind = function (cell, mode, conversion, backConversion) {
	this[mode](cell, conversion, backConversion);
};

nx.Cell.prototype._flatBind = function (cell, selector, conversion, method) {
	var _this = this;
	var binding;

	var getTarget = function (value) {
		var type = typeof selector;
		if (type === 'string') {
			return value[selector];
		} else if (type === 'function') {
			return selector(value);
		}
	};

	var bind = function (value) {
		if (typeof binding !== 'undefined') {
			binding.unbind();
		}
		var target = getTarget(value);
		binding = _this[method](target, conversion);
	};

	if (typeof cell.value !== 'undefined') {
		bind(cell.value);
	}
	cell.onvalue.add(bind);
};

[
	'<-*', '<<-*', '->*', '->>*',
	'*->', '*->>', '*<-', '*<<-'
]
.forEach(function (method) {
	nx.Cell.prototype[method] = function (cell, selector, conversion) {
		this._flatBind(cell, selector, conversion, method.replace('*', ''));
	};
});

module.exports = nx.Cell;
