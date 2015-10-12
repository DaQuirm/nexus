var nx = {
	Command: require('../core/command'),
	Refinement: require('./refinement'),
	Utils: require('../core/utils')
};

nx.FilterRefinement = function (options) {
	options.resetters = { filter: options.filter };
	nx.Refinement.call(this, options);
	this._indexes = [];
};

nx.Utils.mixin(nx.FilterRefinement.prototype, nx.Refinement.prototype);
nx.FilterRefinement.prototype.constructor = nx.FilterRefinement;

nx.FilterRefinement.prototype._filterItems = function (items, values) {
	var indexes = [];
	var filteredItems = [];

	items.forEach(function (item, index) {
		if (this.filter.value.apply(null, values[index])) {
			filteredItems.push(item);
			indexes.push(index);
		}
	}, this);

	return { items: filteredItems, indexes: indexes };
};

nx.FilterRefinement.prototype.append = function (data, values) {
	var filtered = this._filterItems(data.items, values);
	this._indexes = this._indexes.concat(
		filtered.indexes.map(
			function (index) { return index + this._source.items.length; },
			this
		)
	);
	return new nx.Command('append', { items: filtered.items });
};

nx.FilterRefinement.prototype.insertBefore = function (data, values) {
	var filtered = this._filterItems(data.items, values);

	var closestIndex = 0;
	while (this._indexes[closestIndex] < data.index) {
		closestIndex++;
	}
	if (closestIndex === this._indexes.length) {
		this._indexes = this._indexes.concat(
			filtered.indexes.map(function (filteredIndex) {
				return filteredIndex + this._source.items.length;
			}, this)
		);
		return new nx.Command('append', { items: filtered.items });
	} else {
		[].splice.apply(
			this._indexes,
			[closestIndex, 0].concat(
				filtered.indexes.map(function (filteredIndex) {
					return filteredIndex + data.index;
				})
			)
		);
		for (var index = closestIndex + filtered.items.length; index < this._indexes.length; index++) {
			this._indexes[index] += data.items.length;
		}
		return new nx.Command('insertBefore', { index: closestIndex, items: filtered.items });
	}
};

nx.FilterRefinement.prototype.remove = function (data) {
	var filteredIndexes = [];
	data.indexes
		.sort(function (a, b) { return a - b; })
		.forEach(function (index, count) {
			var indexPosition = this._indexes.indexOf(index);
			if (indexPosition !== -1) {
				filteredIndexes.push(indexPosition + count);
				this._indexes.splice(indexPosition, 1);
			}
		}, this);
	return new nx.Command('remove', { indexes: filteredIndexes });
};

nx.FilterRefinement.prototype.reset = function (data, values) {
	var filtered = this._filterItems(data.items, values);
	this._indexes = filtered.indexes;
	return new nx.Command('reset', { items: filtered.items });
};

nx.FilterRefinement.prototype.swap = function () {

};

module.exports = nx.FilterRefinement;
