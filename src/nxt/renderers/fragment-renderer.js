var nxt = {};

nxt.FragmentRenderer = {

	render: function (data, domContext) {
		var nodes = [].slice.call(data.fragment.childNodes);
		if (typeof domContext.content !== 'undefined') {
			domContext.container.insertBefore(data.fragment, domContext.content[0]);
			nxt.FragmentRenderer.unrender(domContext);
		} else if (typeof domContext.insertReference !== 'undefined') {
			domContext.container.insertBefore(data.fragment, domContext.insertReference);
		} else {
			domContext.container.appendChild(data.fragment);
		}
		return nodes;
	},

	visible: function (content) {
		return typeof content !== 'undefined' && content.length > 0;
	},

	unrender: function (domContext) {
		domContext.content.forEach(function (node) {
			domContext.container.removeChild(node);
		});
	}
};

module.exports = nxt.FragmentRenderer;
