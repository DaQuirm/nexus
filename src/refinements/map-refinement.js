var nx = {
	Command: require('../core/command'),
	Refinement: require('./refinement'),
	Utils: require('../core/utils')
};

nx.MapRefinement = function (options) {
	nx.Refinement.call(this, options);
	this._map = options.map;
};

nx.Utils.mixin(nx.MapRefinement.prototype, nx.Refinement.prototype);
nx.MapRefinement.prototype.constructor = nx.MapRefinement;

nx.MapRefinement.prototype.values = function (item) {
	return this._map(item);
};

nx.MapRefinement.prototype.append = function (data, items) {
	return new nx.Command('append', { items: items });
};

nx.MapRefinement.prototype.insertBefore = function (data, items) {
	return new nx.Command('insertBefore', { index: data.index, items: items });
};

nx.MapRefinement.prototype.remove = function (data) {
	return new nx.Command('remove', data);
};

nx.MapRefinement.prototype.reset = function (data, items) {
	return new nx.Command('reset', { items: items });
};

nx.MapRefinement.prototype.swap = function (data) {
	return new nx.Command('swap', data);
};

module.exports = nx.MapRefinement;
