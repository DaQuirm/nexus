var nxt = {};

var FOCUS_ATTR = 'nx-focus';

nxt.NodeRenderer = {

	render: function (data, domContext) {
		if (typeof domContext.content !== 'undefined') {
			domContext.container.replaceChild(data.node, domContext.content);
		} else if (typeof domContext.insertReference !== 'undefined') {
			domContext.container.insertBefore(data.node, domContext.insertReference);
		} else {
			domContext.container.appendChild(data.node);
		}

		if (data.node.nodeType === Node.ELEMENT_NODE && data.node.hasAttribute(FOCUS_ATTR)) {
			var focus = data.node.getAttribute(FOCUS_ATTR);
			if (focus === 'true') {
				data.node.focus();
			} else {
				data.node.blur();
			}
			data.node.removeAttribute(FOCUS_ATTR);
		}

		return data.node;
	},

	visible: function (content) {
		return typeof content !== 'undefined'
			&& (content.nodeType === Node.ELEMENT_NODE || content.nodeType === Node.TEXT_NODE);
	},

	unrender: function (domContext) {
		domContext.container.removeChild(domContext.content);
	}

};

module.exports = nxt.NodeRenderer;
