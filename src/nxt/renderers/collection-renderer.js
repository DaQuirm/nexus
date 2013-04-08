window.nxt = window.nxt || {};

nxt.CollectionRenderer = function(element) {
	var _this = this;
	this.element = element;
	this.content = [];
	this.visible = new nx.Property();
};

nxt.CollectionRenderer.prototype.render = function(data) {
	var _this = this;
	this.collection = data.collection;
	this.conversion = data.conversion;
	this.collection.onappend.add(function(evt){	_this.append(evt); });
	this.collection.oninsertbefore.add(function(evt){ _this.insertBefore(evt); });
	this.collection.onremove.add(function(evt){	_this.remove(evt); });
	this.collection.onreset.add(function(evt){ _this.reset(evt); });
	this.append({items: this.collection.items});
};

nxt.CollectionRenderer.prototype.append = function(evt) {
	var convItems = evt.items.map(this.conversion);
	var manager = new nxt.ContentManager(this.element);
	nxt.ContentManager.prototype.render.apply(manager, convItems);
	this.content = this.content.concat(manager.content);
	this.visible.value = this.content.length > 0;
};

nxt.CollectionRenderer.prototype.insertBefore = function(evt) {
	var _this = this;
	var convItems = evt.items.map(this.conversion).forEach(function(item){
		var renderer = new nxt[item.type+'Renderer'](_this.element);
		renderer.insertReference = _this.element.childNodes[evt.index];
		renderer.render(item);
		if (typeof renderer.content === 'undefined') {
			this.content.splice(evt.index, 1, renderer.content);
		}
	});
};

nxt.CollectionRenderer.prototype.remove = function(evt) {
	var _this = this;
	evt.indexes.forEach(function(index){
		_this.element.removeChild(_this.element.childNodes[index]);
	});
	this.content = [];
	this.visible.value = false;
};

nxt.CollectionRenderer.prototype.reset = function(evt) {
	for (var itemIndex = 0; itemIndex < this.content.length; itemIndex++) {
		this.element.removeChild(this.content[itemIndex]);
	}
	this.content = [];
	this.append(evt);
};
