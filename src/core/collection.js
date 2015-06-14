nx.Collection = function (options) {
	options = options || {};
	nx.Cell.call(this);

	var _this = this;
	this.event = new nx.Cell();
	this.items = options.items || [];
	// this.onsync.add(function (items) {
	// 	_this.event.value = new nxt.Command('Content', 'reset', { items: items });
	// });
	this['->'](this.event, function (items) {
		return new nxt.Command('Content', 'reset', { items: items });
	});

	this.length = new nx.Cell({ value: this.items.length });
	this.length['<-'](this, function (items) { return items.length; });
};

nx.Utils.mixin(nx.Collection.prototype, nx.Cell.prototype);
nx.Collection.prototype.constructor = nx.Collection;

Object.defineProperty(nx.Collection.prototype, 'items', {
	enumerable : true,
	get: function() { return this.value; },
	set: function(items) {
		this.value = items;
		// this.event.value = new nxt.Command('Content', 'reset', { items: items });
	}
});

nx.Collection.prototype.append = function() {
	var args = [].slice.call(arguments);
	this.value = this.value.concat(args);
	this.event.value = new nxt.Command('Content', 'append', { items: args });
};

nx.Collection.prototype.remove = function() {
	var _slice = [].slice;
	var args = _slice.call(arguments);
	var indexes = [];

	this.value = this.items.filter(function(item, index) {
		var argIndex = args.indexOf(item);
		if (argIndex !== -1) {
			indexes.push(index);
			args.splice(argIndex, 1);
			return false;
		}
		return true;
	});
	this.event.value = new nxt.Command('Content', 'remove', {
		items: _slice.call(arguments),
		indexes: indexes
	});
};

nx.Collection.prototype.insertBefore = function(beforeItem, items) {
	items = Array.isArray(items) ? items : [items];
	var insertIndex = this.items.indexOf(beforeItem);
	[].splice.apply(this.items, [insertIndex, 0].concat(items));
	this.event.value = new nxt.Command('Content', 'insertBefore', {
		items: items,
		index: insertIndex
	});
};

nx.Collection.prototype.reset = function(items) {
	this.items = items || [];
};

nx.Collection.prototype.swap = function(firstItem, secondItem) {
	var firstIndex = this.items.indexOf(firstItem);
	var secondIndex = this.items.indexOf(secondItem);
	this.items[firstIndex] = secondItem;
	this.items[secondIndex] = firstItem;
	this.event.value = new nxt.Command('Content', 'swap', {
		indexes: [firstIndex, secondIndex]
	});
};
