window.nxt = window.nxt || {};

nxt.TextRenderer = function(element) {
	this.element = element;
	this.replace = true;
};

nxt.TextRenderer.prototype.render = function(text) {
	if (typeof this.insertReference !== 'undefined') {
		this.element.insertBefore(this.insertReference, text.node);
	} else {
		if (typeof this.content !== 'undefined' && this.replace) {
			this.element.replaceChild(this.content, text.node);
		} else {
			this.element.appendChild(text.node);
		}
	}
	this.content = text.node;
	return this.content;
};