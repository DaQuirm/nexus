var nxt = {};

var FOCUS_ATTR = 'nx-focus';

nxt.NodeRenderer = {

	_isAttached: function (node) {
		var parent;
		while (node.parentNode !== null) {
			node = parent = node.parentNode;
		}
		return parent === document;
	},

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
				nxt.NodeRenderer._postRender = function () {
					data.node.focus();
					nxt.NodeRenderer._postRender = undefined;
				};
			} else {
				nxt.NodeRenderer._postRender = function () {
					data.node.blur();
					nxt.NodeRenderer._postRender = undefined;
				};
			}
			data.node.removeAttribute(FOCUS_ATTR);
		}

		if (typeof nxt.NodeRenderer._postRender === 'function') {
			if (nxt.NodeRenderer._isAttached(data.node)) {
				window.setTimeout(nxt.NodeRenderer._postRender, 0);
			}
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
