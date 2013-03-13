window.nxt = window.nxt || {};

nxt.ContentRegion = function(element) {
	this.element = element;
	this.items = [];
	this.visibility = [];
};

nxt.ContentRegion.prototype.add = function(item) {
	var id = this.items.length;
	this.items.push(item);
	item.property.onvalue.add(function(value) {
		var wasVisible = this.visibility[id];
		if (typeof value !== 'undefined') {
			if (!wasVisible) {

			}
		}
	});
};

nxt.ContentRegion.prototype.update = function() {

};
