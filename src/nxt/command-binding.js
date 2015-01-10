window.nxt = window.nxt || {};

nxt.CommandBinding = function(source, target, conversion) {
	nx.Binding.call(this, source, target, conversion);
};

nx.Utils.mixin(nx.CommandBinding.prototype, nx.Binding.prototype);
