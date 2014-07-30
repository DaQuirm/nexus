window.nxt = window.nxt || {};

nxt.EventRenderer = function() {};

nxt.EventRenderer.prototype.add = function(data, domContext) {
	domContext.container.addEventListener(data.name, data.handler);
};
