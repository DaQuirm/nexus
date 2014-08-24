window.nxt = window.nxt || {};

nxt.EventRenderer = function() {};

nxt.EventRenderer.prototype.add = function(data, domContext) {
	domContext.container.addEventListener(data.name, data.handler);
	return data;
};

nxt.EventRenderer.prototype.unrender = function(domContext) {
	domContext.container.removeEventListener(domContext.content.name, domContext.content.handler);
};
