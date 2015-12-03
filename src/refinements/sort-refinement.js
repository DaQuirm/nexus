var nx = {
	Command: require('../core/command'),
	OrderTree: require('./order-tree'),
	Refinement: require('./refinement'),
	Utils: require('../core/utils')
};

nx.SortRefinement = function (options) {
	options.resetters = { compare: options.compare };
	nx.Refinement.call(this, options);
	var values = this._source.items.map(this.values.bind(this));
	this._compare = function (one, another) {
		return options.compare(one.value, another.value);
	};
	this._tree = new nx.OrderTree(values, this._compare);
};

nx.Utils.mixin(nx.SortRefinement.prototype, nx.Refinement.prototype);
nx.SortRefinement.prototype.constructor = nx.SortRefinement;

nx.SortRefinement.prototype.values = function (item, index) {
	var value = nx.Refinement.prototype.values.call(this, item);
	return {
		item: item,
		index: index,
		value: value
	};
};

nx.SortRefinement.prototype._insert = function (items, values) {
	return items.map(function (item, index) {
		var position = this._tree.insert(values[index]);
		if (position === this._source.items.length + index) {
			return new nx.Command('append', { items: [item] });
		} else {
			return new nx.Command(
				'insertBefore',
				{ index: position, items: [item] }
			);
		}
	}, this);
};

nx.SortRefinement.prototype.append = function (data, values) {
	return this._insert(data.items, values);
};

nx.SortRefinement.prototype.reset = function (data, values) {
	this._tree = new nx.OrderTree(values, this._compare);
	var items = this._tree.list().map(function (item) {
		return data.items[item.index];
	});
	return new nx.Command('reset', { items: items });
};

nx.SortRefinement.prototype.insertBefore = function (data, values) {
	return this._insert(data.items, values);
};

nx.SortRefinement.prototype.remove = function () {
	// for (var index = 0; index < data.items.length; index++) {
	// 	var item = data.items[index];
	// 	this._orderTree.remove(this._orderTree.find(item));
	// 	this.refined.remove(item);
	// }
};

module.exports = nx.SortRefinement;
