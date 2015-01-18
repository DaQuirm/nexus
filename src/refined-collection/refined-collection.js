nx.RefinedCollection = function (collection, refinement) {
	var _this = this;

	nx.Collection.call(this, {
		items: collection.items
	});

	this.collection = collection;

	this.refinement = new nx.Cell({
		value: refinement,
		action: function (refinement) {
			_this._refine(refinement);
		}
	});

	this._refine(refinement);

	this.event['<-'](collection.event, function (command) {
		_this._update(command);
	});
};

nx.Utils.mixin(nx.RefinedCollection.prototype, nx.Collection.prototype);

nx.RefinedCollection.prototype._createRefinement = function (refinement) {
	var key = Object.keys(refinement)[0];
	var type = key.charAt(0).toUpperCase() + key.slice(1); // 'filter' --> 'Filter'
	return new nx[type + 'Refinement'](this, refinement[key]);
};

nx.RefinedCollection.prototype._refine = function (refinement) {
	this._refinement = this._createRefinement(refinement);
	this._refinement.reset({ items: this.collection.items });
};

nx.RefinedCollection.prototype._update = function (command) {
	this._refinement[command.method](command.data);
};
