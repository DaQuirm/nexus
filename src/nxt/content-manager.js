window.nxt = window.nxt || {};

nxt.ContentManager = function(element) {
	this.element = element;
	this.renderers = {};
	this.regions = [];
};

nxt.ContentManager.prototype.render = function() {
	var args = Array.prototype.slice.call(arguments);
	var _this = this;
	var newRegion;
	args.forEach(function(item){
		if (!item.dynamic) {
			if (typeof _this.renderers[item.type] === 'undefined') {
				_this.renderers[item.type] = new nxt[item.type+'Renderer'](_this.element);
			}
			if (_this.renderers[item.type].replace) {
				_this.renderers[item.type].replace = false;
			}
			_this.renderers[item.type].render(item);
			if (typeof newRegion !== 'undefined' && newRegion.items.length > 0) { // dynamic content followed by static content
				newRegion.insertReference = item.node;
				_this.regions.push(newRegion);
				newRegion = new nxt.ContentRegion(_this.element);
			}
		} else {
			var renderer = new nxt[item.type+'Renderer'](_this.element);
			renderer.render(item);
			if (typeof newRegion === 'undefined') { // dynamic content item is the first one
				newRegion = new nxt.ContentRegion(_this.element);
			}
			newRegion.add(renderer);
		}
	});
	if (newRegion && newRegion.items.length > 0) {
		this.regions.push(newRegion);
	}
};
