window.nxt = window.nxt || {};

nxt.EventRenderer = function(element) {
	this.element = element;
};

nxt.EventRenderer.prototype.render = function(event) {
	this.element.addEventListener(event.name, event.handler);
};