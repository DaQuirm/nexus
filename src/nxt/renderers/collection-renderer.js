window.nxt = window.nxt || {};

nxt.CollectionRenderer = function(element) {
	var _this = this;
	this.element = element;
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
	this.contentReference = manager.contentReference;
	this.visible.value = this.collection.items.length > 0;
};

nxt.CollectionRenderer.prototype.insertBefore = function(evt) {
	var _this = this;
	var contentReference;
	var convItems = evt.items.map(this.conversion).forEach(function(item){
		var renderer = new nxt[item.type+'Renderer'](_this.element);
		renderer.insertReference = _this.element.childNodes[evt.index];
		renderer.render(item);
		if (typeof contentReference === 'undefined') {
			contentReference = renderer.content;
		}
	});
	this.contentReference = contentReference;
};

nxt.CollectionRenderer.prototype.remove = function(evt) {
	var _this = this;
	evt.indexes.forEach(function(index){
		_this.element.removeChild(_this.element.childNodes[index]);
	});
	this.visible.value = false;
	this.contentReference = undefined;
};

nxt.CollectionRenderer.prototype.reset = function(evt) {
	while(this.element.firstChild) {
		this.element.removeChild(this.element.firstChild);
	}
	var convItems = evt.items.map(this.conversion);
	var manager = new nxt.ContentManager(this.element);
	nxt.ContentManager.prototype.render.apply(manager, convItems);
	this.contentReference = manager.contentReference;
	this.visible.value = this.collection.items.length > 0;
};
