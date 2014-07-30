window.nxt = window.nxt || {};

nxt.ContentRegion = function(domContext) {
	this.domContext = domContext;
	this.cells = [];
};

nxt.ContentRegion.prototype.add = function(commandCell) {
	var index = this.cells.length;
	var _this = this;
	var cell = new nx.Cell({
		value: {
			index: this.cells.length,
			// copying domContext, because its `content` and `renderer` fields
			// are different for each cell
			domContext: {
				container: this.domContext.container,
				insertReference: this.domContext.insertReference
			},
			visible: false
		},
		action: function(state) { _this.update(state); }
	});

	commandCell.bind(cell, '->', new nx.Mapping({ '_': 'command' }));
	this.cells.push(cell);
};

nxt.ContentRegion.prototype.update = function(state) {
	var hasRenderer = typeof state.renderer !== 'undefined';
	var noCommand = typeof state.command === 'undefined';
	if (hasRenderer) {
		if (noCommand) {
			state.domContext.content = state.renderer.unrender(state.domContext);
			state.visible = false;
		}
		else if (!(state.renderer instanceof nxt[state.command.type+'Renderer'])) {
			state.domContext.content = state.renderer.unrender(state.domContext);
		}
	}
	if (!noCommand) {
		state.domContext.content = state.command.run(state.domContext);
		state.renderer = state.command.renderer;
		if (typeof state.renderer.visible === 'function') {
			state.visible = state.renderer.visible(state.domContext.content);
		} else {
			state.visible = false;
		}
	}
	var insertReference;
	if (state.visible) {
		insertReference = Array.isArray(state.domContext.content)
			? state.domContext.content[0]
			: state.domContext.content; // cell's content will serve as an insert reference
	} else {
		insertReference = state.domContext.insertReference; // item's right visible neighbor will serve as an insert reference
	}
	for (var index = state.index - 1; index >= 0; index--) {
		this.cells[index].value.domContext.insertReference = insertReference;
		if (this.cells[index].value.visible) { break; }
	}
};
