nx.SortRefinement = function (refined, comparator) {
	this.collection = refined.collection;
	this.refined = refined;
	this.comparator = comparator;
};

nx.SortRefinement.prototype._insert = function (items) {
	for (var index = 0; index < items.length; index++) {
		var position = this._orderTree.insert(items[index]);
		if (position === this.refined.items.length) {
			this.refined.append(items[index]);
		} else {
			this.refined.insertBefore(
				this.refined.items[position],
				items[index]
			);
		}
	}
};

nx.SortRefinement.prototype.append = function (data) {
	this._insert(data.items);
};

nx.SortRefinement.prototype.reset = function (data) {
	this._orderTree = new nx.OrderTree(data.items, this.comparator);
	this.refined.reset(this._orderTree.list());
};

nx.SortRefinement.prototype.insertBefore = function (data) {
	this._insert(data.items);
};

nx.SortRefinement.prototype.remove = function (data) {
	for (var index = 0; index < data.items.length; index++) {
		var item = data.items[index];
		this._orderTree.remove(this._orderTree.find(item));
		this.refined.remove(item);
	}
};
