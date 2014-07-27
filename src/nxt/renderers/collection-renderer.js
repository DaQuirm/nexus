window.nxt = window.nxt || {};

nxt.CollectionRenderer = function(element) {
	var _this = this;
	this.element = element;
	this.content = [];
	this.visible = new nx.Cell();
};

nxt.CollectionRenderer.prototype.render = function(data) {
	var _this = this;

	data.events.forEach(function(event) {
		_this.element.addEventListener(event.name, function(evt) {
			var target = evt.target;
			var contentIndex, contentItem;
			_this.content.some(function(item, index) {
				var found = item.isEqualNode(target) || item.contains(target);
				if (found) {
					contentIndex = index;
					contentItem = item;
				}
				return found;
			});
			var selectors = Object.keys(event.handlers);
			var callMatchingHandlers = function(selector) {
				if (target.matches(selector)) {
					event.handlers[selector].call(
						null,
						evt,
						_this.collection.items[contentIndex]
					);
				}
			};
			while (!contentItem.isEqualNode(target)) {
				selectors.forEach(callMatchingHandlers);
				target = target.parentNode;
			}
			selectors.forEach(callMatchingHandlers);
		});
	});
	if (typeof this.collection.items !== 'undefined') {
		this.append({items: this.collection.items});
	}
};

nxt.CollectionRenderer.prototype.append = function(data, domContext) {
	var convItems = evt.items.map(this.conversion);
	var manager = new nxt.ContentManager(this.element);
	nxt.ContentManager.prototype.render.apply(manager, convItems);
	this.content = this.content.concat(manager.content);
	this.visible.value = this.content.length > 0;
};

nxt.CollectionRenderer.prototype.insertBefore = function(data, domContext) {
	var _this = this;
	var convItems = evt.items.map(this.conversion).forEach(function(item) {
		var renderer = new nxt[item.type+'Renderer'](_this.element);
		renderer.insertReference = _this.element.childNodes[evt.index];
		renderer.render(item);
		if (typeof renderer.content === 'undefined') {
			this.content.splice(evt.index, 1, renderer.content);
		}
	});
};

nxt.CollectionRenderer.prototype.remove = function(data, domContext) {
	var _this = this;
	evt.indexes.forEach(function(index){
		_this.element.removeChild(_this.element.childNodes[index]);
		_this.content.splice(index, 1);
	});
	this.visible.value = this.content.length > 0;
};

nxt.CollectionRenderer.prototype.reset = function(data, domContext) {
	for (var itemIndex = 0; itemIndex < this.content.length; itemIndex++) {
		this.element.removeChild(this.content[itemIndex]);
	}
	this.content = [];
	this.append(evt);
};
