window.nxt = window.nxt || {};

nxt.ContentRenderer = function() {};

nxt.ContentRenderer.prototype.render = function(data, domContext) {
	this.regions = [];
	var cells = [];
	var contentItems = [];
	var _this = this;

	data.items.forEach(function (command) {
		if (command !== undefined) {
			if (command instanceof nxt.Command) {
				var content = command.run(domContext);
				contentItems.push(content);
				if (cells.length > 0) { // dynamic content followed by static content
					var regionContext = { container: domContext.container };
					// only DOM-visible items can serve as an insert reference
					var renderer = new nxt[command.type + 'Renderer']();
					if (nxt.NodeRenderer.prototype.visible(content)) {
						regionContext.insertReference = content;
					}
					_this.createRegion(regionContext, cells);
					cells = [];
				}
			} else { // command is really a cell
				cells.push(command);
			}
		}
	});

	if (cells.length > 0) {
		// no need for an insert reference as these cells' content is appended by default
		this.createRegion({ container: domContext.container, insertReference: domContext.insertReference }, cells);
	}
	return contentItems;
};

nxt.ContentRenderer.prototype.createRegion = function(domContext, cells) {
	var newRegion = new nxt.ContentRegion(domContext);
	for (var itemIndex = 0; itemIndex < cells.length; itemIndex++) {
		newRegion.add(cells[itemIndex]);
	}
	this.regions.push(newRegion);
};

nxt.ContentRenderer.prototype.append = function(data, domContext) {
	return (domContext.content || []).concat(
		this.render(data, {
			container: domContext.container,
			insertReference: domContext.insertReference
		})
	);
};

nxt.ContentRenderer.prototype.insertBefore = function(data, domContext) {
	data.items.forEach(function (item, index) {
		var content = item.run({
			container: domContext.container,
			insertReference: domContext.content[data.insertIndex + index]
		});
		domContext.content.splice(data.insertIndex + index, 0, content);
	});
	return domContext.content;
};

nxt.ContentRenderer.prototype.remove = function(data, domContext) {
	data.indexes
		.sort(function (a,b) { return a - b; })
		.forEach(function (removeIndex, index) {
			domContext.container.removeChild(domContext.content[removeIndex - index]);
			domContext.content.splice(removeIndex - index, 1);
		});
	return domContext.content;
};

nxt.ContentRenderer.prototype.reset = function(data, domContext) {
	var firstChild;
	if (typeof domContext.content !== 'undefined') {
		for (var index = 0; index < domContext.content.length; index++) {
			domContext.container.removeChild(domContext.content[index]);
		}
		delete domContext.content;
	}
	return this.render(data, domContext);
};

nxt.ContentRenderer.prototype.get = function(data, domContext) {
	data.next(domContext.content);
	return domContext.content;
};

nxt.ContentRenderer.prototype.visible = function(content) {
	return content.some(nxt.NodeRenderer.prototype.visible);
};
