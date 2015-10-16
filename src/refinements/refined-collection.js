var nx = {
	Cell:       require('../core/cell'),
	Collection: require('../core/collection'),
	Command:    require('../core/command'),
	Utils:      require('../core/utils')
};

nx.RefinedCollection = function (source, refinement, binding) {
	var _this = this;
	binding = binding || '->';

	nx.Collection.call(this);

	this.source = source;
	this.refinement = new nx.Cell({ value: refinement });

	var conversion = function (command) {
		return _this.refinement.value.refine(command);
	};

	this.source.command[binding](this.command, conversion);
	refinement.command['->'](this.command, conversion);

	if (typeof source.transform.change !== 'undefined') { // nx.LiveTransform
		source.transform.change['->'](this.command, function (change) {
			return _this.refinement.value.live(change);
		});
	}
};

nx.Utils.mixin(nx.RefinedCollection.prototype, nx.Collection.prototype);
nx.RefinedCollection.prototype.constructor = nx.RefinedCollection;

module.exports = nx.RefinedCollection;
