window.nxt = window.nxt || {};

nxt.NodeRenderer = function() {};

nxt.NodeRenderer.prototype.render = function(data, domContext) {
	var content;
	if (typeof domContext.insertReference !== 'undefined') {
		domContext.container.insertBefore(data.node, domContext.insertReference);
	} else {
		if (typeof domContext.content !== 'undefined') {
			domContext.container.replaceChild(data.node, domContext.content);
		} else {
			domContext.container.appendChild(data.node);
		}
	}
	return data.node;
};

nxt.NodeRenderer.prototype.visible = function(content) {
	return typeof content !== 'undefined';
};

nxt.NodeRenderer.prototype.unrender = function(domContext) {
	domContext.container.removeChild(domContext.content);
};
