window.nxt = window.nxt || {};

nxt.AttrRenderer = function() {};

nxt.AttrRenderer.prototype.render = function(data, domContext) {
	var attrMap = {};
	if (typeof data.items !== 'undefined') {
		for (var key in data.items) {
			domContext.container.setAttribute(key, data.items[key]);
		}
		attrMap = data.items;
	} else {
		domContext.container.setAttribute(data.name, data.value);
		attrMap[data.name] = data.value;
	}
	return attrMap;
};

nxt.AttrRenderer.prototype.unrender = function(domContext) {
	for (var key in domContext.content) {
		domContext.container.removeAttribute(key);
	}
};
