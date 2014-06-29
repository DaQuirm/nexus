window.nx = window.nx || {};

nx.Collection = function (options) {
	options = options || {};

	if (typeof options.items !== 'undefined') {
		this.items = options.items;
	} else {
		this.items = [];
	}

	this.onappend = new nx.Event();
	this.onremove = new nx.Event();
	this.oninsertbefore = new nx.Event();
	this.onreset = new nx.Event();

	this.cell = new nx.Cell({ value: this.items });
	var _this = this;
	this.cell.onsync.add(function(items) {
		_this.items = items;
		_this.onreset.trigger({ items:items });
	});
};

nx.Collection.prototype.append = function() {
	var args = [].slice.call(arguments);
	var _this = this;
	args.forEach(function(item) {
		_this.items.push(item);
	});
	this.onappend.trigger({items: args});
	this.cell.value = this.items;
};

nx.Collection.prototype.remove = function() {
	var _slice = [].slice;
	var args = _slice.call(arguments);
	var indexes = [];

	this.items = this.items.filter(function(item, index) {
		var argIndex = args.indexOf(item);
		if (argIndex !== -1) {
			indexes.push(index);
			args.splice(argIndex, 1);
			return false;
		}
		return true;
	});
	this.onremove.trigger({items: _slice.call(arguments), indexes: indexes});
	this.cell.value = this.items;
};

nx.Collection.prototype.insertBefore = function(beforeItem, items) {
	items = Array.isArray(items) ? items : [items];
	var insertIndex = this.items.indexOf(beforeItem);
	[].splice.apply(this.items, [insertIndex, 0].concat(items));
	this.oninsertbefore.trigger({items: items, index: insertIndex});
	this.cell.value = this.items;
};

nx.Collection.prototype.removeAll = function() {
	this.items = [];
	this.onreset.trigger({items:[]});
	this.cell.value = this.items;
};

nx.Collection.prototype.set = function(array) {
	this.items = array;
	this.onreset.trigger({items:array});
	this.cell.value = this.items;
};

nx.Collection.prototype.bind = function(cell, mode, converter) {
	return this.cell.bind(cell, mode, converter);
};
