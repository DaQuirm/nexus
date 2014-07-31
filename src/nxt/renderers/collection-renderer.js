window.nxt = window.nxt || {};

nxt.CollectionRenderer = function() {
	this.manager = new nxt.ContentManager();
};

nxt.CollectionRenderer.prototype.render = function(data) {
	var _this = this;

	data.events.forEach(function(event) {
		_this.element.addEventListener(event.name, function(evt) {
			var target = evt.target;
			var contentIndex, contentItem;
			_this.content.some(function(item, index) {
				var found = item.isEqualNode(target) || item.contains(target);
				if (found) {
					contentIndex = index;
					contentItem = item;
				}
				return found;
			});
			var selectors = Object.keys(event.handlers);
			var callMatchingHandlers = function(selector) {
				if (target.matches(selector)) {
					event.handlers[selector].call(
						null,
						evt,
						_this.collection.items[contentIndex]
					);
				}
			};
			while (!contentItem.isEqualNode(target)) {
				selectors.forEach(callMatchingHandlers);
				target = target.parentNode;
			}
			selectors.forEach(callMatchingHandlers);
		});
	});
	if (typeof this.collection.items !== 'undefined') {
		this.append({items: this.collection.items});
	}
};

nxt.CollectionRenderer.prototype.visible = function(content) {
	return content.length > 0;
};

nxt.CollectionRenderer.prototype.append = function(data, domContext) {
	return this.manager.append(data.items, domContext);
};

nxt.CollectionRenderer.prototype.insertBefore = function(data, domContext) {
	return this.manager.insertBefore(data.index, data.items, domContext);
};

nxt.CollectionRenderer.prototype.remove = function(data, domContext) {
	return this.manager.remove(data.indexes, domContext);
};

nxt.CollectionRenderer.prototype.reset = function(data, domContext) {
	return this.manager.reset(data.items, domContext);
};
