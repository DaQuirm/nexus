var nxt = {};

nxt.ClassRenderer = {

	render: function (data, domContext) {
		if (typeof domContext.content !== 'undefined') {
			nxt.ClassRenderer.unrender(domContext);
		}
		domContext.container.classList.add(data.name);
		return data.name;
	},

	unrender: function (domContext) {
		domContext.container.classList.remove(domContext.content);
	}

};

module.exports = nxt.ClassRenderer;
