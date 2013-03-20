window.nxt = window.nxt || {};

nxt.ContentManager = function(element) {
	this.element = element;
	this.renderers = {};
};

nxt.ContentManager.prototype.render = function() {
	var args = Array.prototype.slice.call(arguments);
	for (var item in args) {
		if (typeof this.renderers[item.type] === 'undefined') {
			this.renderers[item.type] = new nxt['Renderer'+item.type]();
		}
	}
};
