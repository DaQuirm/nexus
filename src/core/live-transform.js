var nx = {
	ArrayTransform: require('./array-transform'),
	Cell:           require('./cell')
};

nx.LiveTransform = function (cells) {

	var transform = function (items, command) {
		nx.LiveTransform[command.method](transform, command.data);
		return nx.ArrayTransform(items, command);
	};

	transform.change = new nx.Cell();
	transform._cells = cells;
	transform.bindings = [];
	transform._length = 0;
	return transform;
};

nx.LiveTransform._changeConversion = function (value, item, cell) {
	return {
		item: item,
		cell: cell,
		value: value
	};
};

nx.LiveTransform._bind = function (transform, cellMap, item) {
	return Object.keys(cellMap).map(function (key) {
		var cell = cellMap[key];
		return transform.change['<-'](cell, function (value) {
			return nx.LiveTransform._changeConversion(value, item, key);
		});
	});
};

nx.LiveTransform._bindItems = function (transform, items) {
	return items.map(function (item) {
		var cellMap = nx.LiveTransform.cells(transform, item);
		return nx.LiveTransform._bind(transform, cellMap, item);
	});
};

nx.LiveTransform.cells = function (transform, item) {
	var cells = {};
	if (Array.isArray(transform._cells)) {
		transform._cells.forEach(function (name) {
			cells[name] = item[name];
		});
	} else if (typeof transform._cells === 'function') {
		cells = transform._cells(item);
	}
	return cells;
};

nx.LiveTransform.append = function (transform, data) {
	var bindings = nx.LiveTransform._bindItems(transform, data.items);
	[].push.apply(transform.bindings, bindings);
};

nx.LiveTransform.remove = function (transform, data) {
	data.indexes.forEach(function (index, count) {
		var bindingSet = transform.bindings[index - count];
		bindingSet.forEach(function (binding) {
			binding.unbind();
		});
		transform.bindings.splice(index - count, 1);
	});
};

nx.LiveTransform.insertBefore = function (transform, data) {
	var bindings = nx.LiveTransform._bindItems(transform, data.items);
	[].splice.apply(transform.bindings, [data.index, 0].concat(bindings));
};

nx.LiveTransform.reset = function (transform, data) {
	transform.bindings.forEach(function (bindingSet) {
		bindingSet.forEach(function (binding) {
			binding.unbind();
		});
	});

	transform.bindings = [];
	transform._length = 0;

	nx.LiveTransform.append(transform, data);
};

nx.LiveTransform.swap = function (transform, data) {
	transform.bindings = nx.ArrayTransform.swap(data, transform.bindings);
};

module.exports = nx.LiveTransform;
