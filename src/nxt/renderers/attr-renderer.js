window.nxt = window.nxt || {};

nxt.AttrRenderer = function(element) {
	this.element = element;
};

nxt.AttrRenderer.prototype.render = function(attr) {
	if (typeof attr.items !== 'undefined') {
		for (var key in attr.items) {
			this.element.setAttribute(key, attr.items[key]);
		}
	} else {
		this.element.setAttribute(attr.name, attr.value);
	}
};
