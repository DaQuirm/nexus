window.nxt = window.nxt || {};

nxt.NodeRenderer = function() {};

nxt.NodeRenderer.prototype.render = function(domContext, element) {
	if (!domContext.remove) {
		if (typeof domContext.insertReference !== 'undefined') {
			domContext.container.insertBefore(element.node, domContext.insertReference);
		} else {
			if (typeof this.content !== 'undefined' && this.replace) {
				domContext.container.replaceChild(element.node, this.content);
			} else {
				domContext.container.appendChild(element.node);
			}
		}
		this.content = element.node;

		domContext.container.removeChild(this.content);
		this.content = undefined;


	return this.content;
};
