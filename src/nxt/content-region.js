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
	item.property.onvalue.add(function(value) {
		var wasVisible = _this.visibility[id];
		if (typeof value !== 'undefined' && !wasVisible) {
			_this.update(id, true);
		} else if (typeof value === 'undefined' && wasVisible) {
			_this.update(id, false);
		}
	});
};

nxt.ContentRegion.prototype.update = function(id, visible) {
	this.visibility[id] = visible;
	var insertReference;
	if (visible) {
		insertReference = this.items[id].contentRenderer.content;
	} else if (this.insertReference) {
		insertReference = this.insertReference;
	} else {
		insertReference = this.items[id].insertReference;
	}
	for (var index = id-1; index >= 0; index--) {
		if (this.visibility[index]) { break; }
		this.items[index].insertReference = insertReference;
	}
};
