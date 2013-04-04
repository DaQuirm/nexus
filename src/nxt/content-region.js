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
		insertReference = this.items[id].insertReference; //contentRenderer ? this.items[id].contentRenderer.content : this.items[id].collection.items[0];
	} else if (this.insertReference) {
		insertReference = this.insertReference;
	} else {
		insertReference = this.items[id].insertReference;
	}
	for (var index = id-1; index >= 0; index--) {
		this.items[index].insertReference = insertReference;
		if (this.visibility[index]) { break; }
	}
};
