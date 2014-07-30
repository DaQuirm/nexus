window.nxt = window.nxt || {};

nxt.ContentManager = function() {};

nxt.ContentManager.prototype.render = function(items, domContext) {
	this.regions = [];
	var cells = [];
	var contentItems = domContext.content || [];

	var _this = this;
	var createRegion = function(domContext, cells) {
		var newRegion = new nxt.ContentRegion(domContext);
		for (var itemIndex = 0; itemIndex < cells.length; itemIndex++) {
			newRegion.add(cells[itemIndex]);
		}
		_this.regions.push(newRegion);
	};

	items.forEach(function (command, index) {
		if (command !== undefined) {
			if (!(command instanceof nx.Cell)) {
				var content = command.run(domContext);
				contentItems.push(content);
				if (cells.length > 0) { // dynamic content followed by static content
					createRegion(
						{
							container: domContext.container,
							insertReference: content
						},
						cells
					);
					cells = [];
				}
			} else {
				cells.push(command);
			}
		}
	});

	if (cells.length > 0) {
		// no need for an insert reference as these cells' content is appended by default
		createRegion({ container: domContext.container }, cells);
	}
	return contentItems;
};

nxt.ContentManager.prototype.insertBefore = function(insertIndex, items, domContext) {
	items.forEach(function (item, index) {
		var content = item.run({
			container: domContext.container,
			insertReference: domContext.content[insertIndex + index]
		});
		domContext.content.splice(insertIndex + index, 0, content);
	});
	return domContext.content;
};

nxt.ContentManager.prototype.remove = function(indexes, domContext) {
	indexes
		.sort(function (a,b) { return a - b; })
		.forEach(function (removeIndex, index) {
			domContext.container.removeChild(domContext.container.childNodes[removeIndex - index]);
			domContext.content.splice(removeIndex - index, 1);
		});
	return domContext.content;
};

nxt.ContentManager.prototype.reset = function(items, domContext) {
	var firstChild;
	for (var index = 0; index < domContext.content.length; index++) {
		domContext.container.removeChild(domContext.content[index]);
	}
	delete domContext.content;
	return this.render(items, domContext);
};
