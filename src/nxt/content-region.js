window.nxt = window.nxt || {};

nxt.ContentRegion = function(element) {
	this.element = element;
	this.items = [];
	this.visibility = [];
};

nxt.ContentRegion.prototype.add = function(item) {
	var id = this.items.length;
	var _this = this;
	this.items.push(item);
	if (typeof this.insertReference !== 'undefined') {
		item.insertReference = this.insertReference;
	}
	item.visible.onvalue.add(function(visible) {
		var wasVisible = _this.visibility[id];
		if (visible && !wasVisible) {
			_this.update(id, true);
		} else if (!visible && wasVisible) {
			_this.update(id, false);
		}
	});
};

nxt.ContentRegion.prototype.update = function(id, visible) {
	this.visibility[id] = visible;
	var insertReference;
	if (visible) {
		insertReference = Array.isArray(this.items[id].content) ? this.items[id].content[0] : this.items[id].content; // item's content will serve as an insert reference
	} else if (this.items[id].insertReference) {
		insertReference = this.items[id].insertReference; // item's right visible neighbor will serve as an insert reference
	} else {
		insertReference = this.insertReference; // a static element adjacent to the region (if any) will serve as an insert reference
	}
	for (var index = id-1; index >= 0; index--) {
		this.items[index].insertReference = insertReference;
		if (this.visibility[index]) { break; }
	}
};
