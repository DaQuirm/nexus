window.nxt = window.nxt || {};

nxt.NodeRenderer = function(element) {
	this.element = element;
	this.replace = true;
};

nxt.NodeRenderer.prototype.render = function(element) {
	if (typeof element !== 'undefined') {
		if (typeof this.insertReference !== 'undefined') {
			this.element.insertBefore(element.node, this.insertReference);
		} else {
			if (typeof this.content !== 'undefined' && this.replace) {
				this.element.replaceChild(element.node, this.content);
			} else {
				this.element.appendChild(element.node);
			}
		}
		this.content = element.node;
	} else {
		this.element.removeChild(this.content);
		this.content = undefined;
	}

	return this.content;
};
