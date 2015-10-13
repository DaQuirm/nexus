var nx = {
	ArrayTransform:    require('./array-transform'),
	Cell:              require('./cell'),
	Command:           require('./command'),
	FilterRefinement:  require('../refinements/filter-refinement'),
	MapRefinement:     require('../refinements/map-refinement'),
	Utils:             require('./utils')
};

nx.Collection = function (options) {
	options = options || {};
	nx.Cell.call(this, { value: [] });

	var _this = this;
	this.transform = options.transform || nx.ArrayTransform;

	this.command = new nx.Cell();
	this['<->'](
		this.command,
		function (items) {
			return new nx.Command('reset', { items: items });
		},
		function (command) {
			return _this.transform(_this.items, command);
		}
	);

	this.reset(options.items || []);

	this.length = new nx.Cell({ value: this.items.length });
	this.length['<-'](this, function (items) { return items.length; });
};

nx.Collection.mapCommand = function (command, conversion) {
	var data = {};
	for (var key in command.data) {
		if (key !== 'items') {
			data[key] = command.data[key];
		} else {
			data.items = command.data.items.map(conversion);
		}
	}
	return new nx.Command(command.method, data);
};

nx.Utils.mixin(nx.Collection.prototype, nx.Cell.prototype);
nx.Collection.prototype.constructor = nx.Collection;

Object.defineProperty(nx.Collection.prototype, 'items', {
	enumerable : true,
	get: function () { return this.value; },
	set: function (items) {
		this.value = items;
	}
});

nx.Collection.prototype.append = function () {
	var args = [].slice.call(arguments);
	this.command.value = new nx.Command('append', { items: args });
};

nx.Collection.prototype.remove = function () {
	var args = [].slice.call(arguments);
	var _this = this;
	var indexes = args.map(function (item) {
		return _this.items.indexOf(item);
	});
	this.command.value = new nx.Command('remove', { indexes: indexes });
};

nx.Collection.prototype.insertBefore = function (beforeItem, items) {
	items = Array.isArray(items) ? items : [items];
	var insertIndex = this.items.indexOf(beforeItem);
	this.command.value = new nx.Command('insertBefore', {
		items: items,
		index: insertIndex
	});
};

nx.Collection.prototype.reset = function (items) {
	this.command.value = new nx.Command('reset', { items: items || [] });
};

nx.Collection.prototype.swap = function (firstItem, secondItem) {
	var firstIndex = this.items.indexOf(firstItem);
	var secondIndex = this.items.indexOf(secondItem);
	this.command.value = new nx.Command('swap', {
		indexes: [firstIndex, secondIndex]
	});
};

/* Refinement methods */

nx.Collection.prototype.map = function (map) {
	return new nx.RefinedCollection(
		this,
		new nx.MapRefinement({ source: this, map: map })
	);
};

nx.Collection.prototype.filter = function(options) {
	options.source = this;
	return new nx.RefinedCollection(
		this,
		new nx.FilterRefinement(options)
	);
};

module.exports = nx.Collection;

nx.RefinedCollection = require('../refinements/refined-collection');
