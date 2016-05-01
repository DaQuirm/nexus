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
	var originalLength = this._source.items.length - data.items.length;
	this._indexes = this._indexes.concat(
		filtered.indexes.map(
			function (index) { return index + originalLength; },
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
		var originalLength = this._source.items.length - data.items.length;
		this._indexes = this._indexes.concat(
			filtered.indexes.map(function (filteredIndex) {
				return filteredIndex + originalLength;
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
	var newIndexes = [];
	var refinedIndexes = [];
	this._indexes.forEach(function (index, refinedIndex) {
		var indexPosition = data.indexes.indexOf(index);
		if (indexPosition !== -1) {
			refinedIndexes.push(refinedIndex);
		} else {
			newIndexes.push(index - refinedIndexes.length);
		}
	});
	this._indexes = newIndexes;
	return new nx.Command('remove', { indexes: refinedIndexes });
};

nx.FilterRefinement.prototype.reset = function (data, values) {
	var filtered = this._filterItems(data.items, values);
	this._indexes = filtered.indexes;
	return new nx.Command('reset', { items: filtered.items });
};

nx.FilterRefinement.prototype.change = function (change, values) {
	var index = this._source.items.indexOf(change.item);
	var filteredIndex = this._indexes.indexOf(index);
	var wasFiltered = filteredIndex !== -1;
	var isFiltered = this.filter.value.apply(null, values);
	if (wasFiltered && !isFiltered) {
		var indexes = wasFiltered ? [filteredIndex] : [];
		this._indexes.splice(filteredIndex, 1);
		return new nx.Command('remove', { indexes: indexes });
	} else if (!wasFiltered && isFiltered) {
		if (filteredIndex === this._source.items.length - 1) {
			return new nx.Command('append', { items: [change.item] });
		}
		return this.insertBefore({ index: index, items: [change.item] }, [values]);
	} else {
		return new nx.Command('remove', { indexes: [] });
	}
};

nx.FilterRefinement.prototype.swap = function () {

};

module.exports = nx.FilterRefinement;
