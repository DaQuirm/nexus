nx.FilterRefinement = function (refined, filter) {
	this.collection = refined.collection;
	this.refined = refined;
	this.filter = filter;
};

nx.FilterRefinement.prototype._filterItems = function (items) {
	var filteredItems = [];
	for (var index = 0; index < items.length; index++) {
		var item = items[index];
		if (this.filter(item)) {
			filteredItems.push(item);
		}
	}
	return filteredItems;
};

nx.FilterRefinement.prototype.append = function (data) {
	this.refined.append.apply(this.refined, this._filterItems(data.items));
};

nx.FilterRefinement.prototype.reset = function (data) {
	this.refined.reset(this._filterItems(data.items));
};

nx.FilterRefinement.prototype.insertBefore = function (data) {
	var filteredItems = this._filterItems(data.items);
	var closestItem = null;
	for (var index = data.index; index < this.collection.items.length; index++) {
		var item = this.collection.items[index];
		if (this.filter(item)) {
			closestItem = item;
			break;
		}
	}
	for (index = 0; index < filteredItems.length; index++) {
		if (closestItem !== null) {
			this.refined.insertBefore(closestItem, filteredItems[index]);
		} else {
			this.refined.append(filteredItems[index]);
		}
	}
};

nx.FilterRefinement.prototype.remove = function (data) {
	var filteredItems = this._filterItems(data.items);
	this.refined.remove.apply(this.refined, filteredItems);
};
