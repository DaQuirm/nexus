window.nxt = window.nxt || {};

nxt.CommandCell = function(options) {
	nx.Cell.call(this, options);
	this.children = [];
};

nx.Utils.mixin(nxt.CommandCell.prototype, nx.Cell.prototype);

nxt.CommandCell.prototype.reverseBind = function (cell, conversion) {
	this._binding = new nxt.CommandBinding(cell, this, conversion);
	this._binding.sync();
	return this._binding;
};

nxt.CommandCell.prototype.unbind = function () {
	if (typeof this._binding !== 'undefined') {
		this._binding.unbind();
	}
};