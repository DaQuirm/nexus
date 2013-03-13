window.nxt = window.nxt || {};

nxt.BindingRenderer = function(element) {
	var _this = this;
	this.element = element;
	this.property = new nx.Property();
	this.property.onvalue.add(function(data) {
		if (!_this.contentRenderer || !_this.contentRenderer instanceof nxt[data.type+'Renderer']) {
			_this.contentRenderer = new nxt[data.type+'Renderer'](_this.element);
			_this.contentRenderer.insertReference = _this.insertReference;
		}
		_this.contentRenderer.render(data);
	});
};

nxt.BindingRenderer.prototype.render = function(binding) {
	this.binding = binding.property.bind(this.property, binding.mode, binding.conversion);
};
