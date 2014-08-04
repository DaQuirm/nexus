window.nx = window.nx || {};

nx.Collection = function (options) {
	options = options || {};
	nx.Cell.call(this);

	var _this = this;
	this.event = new nx.Cell();
	this.items = options.items || [];
	this.onsync.add(function (items) {
		_this.event.value = new nxt.Command('Collection', 'reset', { items: items });
	});
};

nx.Collection.prototype = Object.create(nx.Cell.prototype);
nx.Collection.prototype.constructor = nx.Collection;

Object.defineProperty(nx.Collection.prototype, 'items', {
	enumerable : true,
	get: function() { return this.value; },
	set: function(items) {
		this.value = items;
		this.event.value = new nxt.Command('Collection', 'reset', { items: items });
	}
});

nx.Collection.prototype.append = function() {
	var args = [].slice.call(arguments);
	this.value = this.value.concat(args);
	this.event.value = new nxt.Command('Collection', 'append', { items: args });
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
	this.event.value = new nxt.Command('Collection', 'remove', {
		items: _slice.call(arguments),
		indexes: indexes
	});
};

nx.Collection.prototype.insertBefore = function(beforeItem, items) {
	items = Array.isArray(items) ? items : [items];
	var insertIndex = this.items.indexOf(beforeItem);
	[].splice.apply(this.items, [insertIndex, 0].concat(items));
	this.event.value = new nxt.Command('Collection', 'insertBefore', {
		items: items,
		index: insertIndex
	});
};

nx.Collection.prototype.removeAll = function() {
	this.items = [];
};
