window.nxt = window.nxt || {};

nxt.ClassRenderer = function() {};

nxt.ClassRenderer.prototype.add = function(data, domContext) {
	domContext.container.classList.add(data.name);
};

nxt.ClassRenderer.prototype.remove = function(data, domContext) {
	domContext.container.classList.remove(data.name);
};
