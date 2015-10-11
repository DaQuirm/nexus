var nx = {
	Cell:       require('../core/cell'),
	Collection: require('../core/collection'),
	Utils:      require('../core/utils')
};

nx.RefinedCollection = function (source, refinement) {
	var _this = this;

	nx.Collection.call(this);

	this.source = source;
	this.refinement = new nx.Cell({ value: refinement });

	this.source.command['->'](this.command, function (command) {
		return _this.refinement.value.refine(command);
	});

	if (typeof source.transform.change !== 'undefined') { // nx.LiveTransform
		source.transform.change['->'](this.command, function (change) {
			return _this.refinement.value.live(change);
		});
	}
};

nx.Utils.mixin(nx.RefinedCollection.prototype, nx.Collection.prototype);
nx.RefinedCollection.prototype.constructor = nx.RefinedCollection;

module.exports = nx.RefinedCollection;
