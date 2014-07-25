window.nxt = window.nxt || {};

nxt.NodeRenderer = function() {};

nxt.NodeRenderer.prototype.render = function(domContext, element) {
	var content;
	if (!domContext.remove) {
		if (typeof domContext.insertReference !== 'undefined') {
			domContext.container.insertBefore(element.node, domContext.insertReference);
		} else {
			if (typeof domContext.content !== 'undefined' && domContext.replace) {
				domContext.container.replaceChild(element.node, domContext.content);
			} else {
				domContext.container.appendChild(element.node);
			}
		}
		content = element.node;
	} else {
		domContext.container.removeChild(domContext);
	}
	return content;
};

nxt.NodeRenderer.prototype.visible = function(content) {
	return typeof content !== 'undefined';
};
