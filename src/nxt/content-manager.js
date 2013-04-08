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
	var dynamicItems = [];
	this.content = [];
	args.forEach(function(item, index){
		if (!item.dynamic) {
			if (typeof _this.renderers[item.type] === 'undefined') {
				_this.renderers[item.type] = new nxt[item.type+'Renderer'](_this.element);
			}
			if (_this.renderers[item.type].replace) {
				_this.renderers[item.type].replace = false;
			}
			_this.renderers[item.type].render(item);

			if (typeof _this.renderers[item.type].content !== 'undefined') {
				_this.content.push(_this.renderers[item.type].content);
			}

			if (dynamicItems.length > 0) { // dynamic content followed by static content
				newRegion = new nxt.ContentRegion(_this.element);
				newRegion.insertReference = item.node;
				for (var itemIndex = 0; itemIndex < dynamicItems.length; itemIndex++) {
					newRegion.add(dynamicItems[itemIndex]);
				}
				_this.regions.push(newRegion);
				dynamicItems = [];
			}
		} else {
			var renderer = new nxt[item.type+'Renderer'](_this.element);
			renderer.render(item);
			dynamicItems.push(renderer);
		}
	});
	if (dynamicItems.length > 0) {
		newRegion = new nxt.ContentRegion(_this.element);
		for (var itemIndex = 0; itemIndex < dynamicItems.length; itemIndex++) {
			newRegion.add(dynamicItems[itemIndex]);
		}
		this.regions.push(newRegion);
	}
};
