var nx = {
	Cell:    require('../core/cell'),
	Command: require('../core/command')
};

nx.Refinement = function (options) {
	options = options || {};
	this._values = options.values;
	this._source = options.source;

	var _this = this;
	var reset = function () {
		var command = new nx.Command('reset', { items: _this._source.items });
		_this.refine(command);
	};

	for (var key in options.resetters) {
		this[key] = new nx.Cell({
			value: options.resetters[key],
			action: reset
		});
	}
};

nx.Refinement.prototype.values = function (item) {
	if (typeof this._values === 'function') {
		return this._values(item);
	} else if (Array.isArray(this._values)) {
		return this._values.map(function (key) {
			return item[key].value;
		});
	} else {
		return item;
	}
};

nx.Refinement.prototype.refine = function (command) {
	var method = this[command.method];
	if (typeof method === 'function') {
		var values;
		if (typeof command.data.items !== 'undefined') {
			values = command.data.items.map(this.values.bind(this));
		}
		return command.apply(this, values);
	}
};

nx.Refinement.prototype.live = function (change) {
	if (typeof this.change === 'function') {
		return this.change(change, this.values(change.item));
	}
};

module.exports = nx.Refinement;
