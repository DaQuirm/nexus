window.nxt = window.nxt || {};

nxt.ContentManager = function(domContext) {
	this.domContext = domContext;
	this.renderers = {};
	this.regions = [];
};

nxt.ContentManager.prototype.render = function() {
	var _this = this;
	var args = [].slice.call(arguments);
	var cells = [];

	var createRegion = function(domContext, cells) {
		var newRegion = new nxt.ContentRegion(domContext);
		for (var itemIndex = 0; itemIndex < cells.length; itemIndex++) {
			newRegion.add(cells[itemIndex]);
		}
		_this.regions.push(newRegion);
	};

	args.forEach(function(command, index) {
		if (command !== undefined) {
			if (!(command instanceof nx.Cell)) {
				var content = command.run(_this.domContext);
				if (cells.length > 0) { // dynamic content followed by static content
					createRegion(
						{
							container: _this.domContext.container,
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
		createRegion({ container: _this.domContext.container }, cells);
	}
};
