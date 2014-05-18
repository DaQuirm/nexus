window.nx = window.nx || {};

nx.Collection = function (options) {
	options = options || {};

	if (typeof options.items !== 'undefined') {
		this.items = options.items;
	} else {
		this.items =  [];
	}

	this.onappend = new nx.Event();
	this.onremove = new nx.Event();
	this.oninsertbefore = new nx.Event();
	this.onreset = new nx.Event();
};

nx.Collection.prototype.append = function() {
	var args = Array.prototype.slice.call(arguments);
	var _this = this;
	args.forEach(function(item) {
		_this.items.push(item);
	});
	this.onappend.trigger({items: args});
};

nx.Collection.prototype.remove = function() {
	var _slice = Array.prototype.slice;
	var args = _slice.call(arguments);
	var indexes = [];
	var _this = this;

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
};

nx.Collection.prototype.insertBefore = function(beforeItem, item) {
	var insertIndex = this.items.indexOf(beforeItem);
	this.items.splice(insertIndex, 0, item);
	this.oninsertbefore.trigger({item: item, index: insertIndex});
};

nx.Collection.prototype.removeAll = function() {
	this.items = [];
	this.onreset.trigger({items:[]});
};

nx.Collection.prototype.set = function(array) {
	this.items = array;
	this.onreset.trigger({items:array});
};
