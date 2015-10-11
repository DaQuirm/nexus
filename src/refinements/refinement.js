var nx = {};

nx.Refinement = function (options) {
	this._values = options.values;
	this._source = options.source;
};

nx.Refinement.prototype.values = function (item) {
	if (typeof this._values === 'function') {
		return this._values(item);
	} else if (Array.isArray(this._values)) {
		return this._values.map(function (key) {
			return item[key].value;
		});
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
