window.nxt = window.nxt || {};

nxt.AttrRenderer = function() {};

nxt.AttrRenderer.prototype.render = function(data, domContext) {
	if (typeof data.items !== 'undefined') {
		for (var key in data.items) {
			domContext.container.setAttribute(key, data.items[key]);
		}
	} else {
		domContext.container.setAttribute(data.name, data.value);
	}
};
