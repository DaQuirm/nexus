window.nxt = window.nxt || {};

nxt.AttrRenderer = function(element) {
	this.element = element;
};

nxt.AttrRenderer.prototype.render = function(attr) {
	this.element.setAttribute(attr.name, attr.value);
};
