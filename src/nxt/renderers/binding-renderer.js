window.nxt = window.nxt || {};

nxt.BindingRenderer = function(element) {
	var _this = this;
	this.element = element;

	this.property = new nx.Property();
	this.property.onvalue.add(function(data) {
		if (typeof data !== 'undefined') {
			if (!_this.contentRenderer || !_this.contentRenderer instanceof nxt[data.type+'Renderer']) {
				_this.contentRenderer = new nxt[data.type+'Renderer'](_this.element);
			}
		}
		if (typeof _this.contentRenderer !== 'undefined') {
			_this.contentRenderer.insertReference = _this.insertReference;
			_this.contentRenderer.render(data);
			_this.contentReference = _this.contentRenderer.content;
		}
	});

	this.visible = new nx.Property();
	this.visible.bind(this.property, '<-', function(value) {
		return typeof value !== 'undefined';
	});
};

nxt.BindingRenderer.prototype.render = function(binding) {
	this.binding = binding.property.bind(this.property, binding.mode, binding.conversion);
};
