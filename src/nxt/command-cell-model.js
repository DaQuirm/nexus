window.nxt = window.nxt || {};

nxt.CommandCellModel = {

	cellStack: [],

	enter: function (cell) {
		for (var index = 0; index < cell.children.length; index++) {
			cell.children[index].unbind();
		}
		cell.children = [];

		if (this.cellStack.length > 0) {
			var stackTop = this.cellStack[this.cellStack.length - 1];
			stackTop.children.push(cell);
		}

		this.cellStack.push(cell);
	},

	exit: function () {
		this.cellStack.pop();
	}

};
