(function() {
	'use strict';
window.nx = window.nx || {};

nx.AsyncStatus = {
	LOADING: 1,
	DONE: 2,
	ERROR: 3
};

nx.AjaxModel = function(options) {
	options = options || {};

	this.data = new nx.Cell();
	this.status = new nx.Cell();

	if (typeof options.data !== 'undefined') {
		this.data.value = options.data;
	}
};

nx.AjaxModel.prototype.request = function(options) {
	var _this = this;
	var url = nx.Utils.interpolateString(options.url, options.data);
	this.xhr = new XMLHttpRequest();
	this.xhr.open(options.method, url, true);
	this.xhr.responseType = (!window.chrome) ? 'json' : 'text';

	this.xhr.onload = function (evt) {
		var handler;
		if (this.status === 200 || this.status === 201 || this.status === 204) {
			handler = options.success;
			_this.status.value = nx.AsyncStatus.DONE;
		} else {
			handler = options.error;
			_this.status.value = nx.AsyncStatus.ERROR;
		}
		if (typeof handler === 'function') {
			if (this.responseType === "json") {
				handler(this.response);
			} else if (this.responseText) {
				handler(JSON.parse(this.responseText));
			} else {
				handler();
			}
		}
	};

	if (options.method === 'post' || options.method === 'put') {
		this.xhr.setRequestHeader('Content-Type', 'application/json');
		this.xhr.send(JSON.stringify(options.data));
	} else {
		this.xhr.send();
	}
	_this.status.value = nx.AsyncStatus.LOADING;
};

window.nx = window.nx || {};

nx.Binding = function(source, target, mode, sourceConversion, targetConversion) {
	var _this = this;
	this.mode = mode;
	this.locked = false;

	if (mode === '<->' && sourceConversion instanceof nx.Mapping) {
		targetConversion = targetConversion || sourceConversion.inverse();
	} else if (mode === '<-') {
		targetConversion = targetConversion || sourceConversion;
	}

	if (mode !== '<-') { // -> or <->
		source.onvalue.add(function(value) {
			_this.sync(target, value, sourceConversion);
		});
	}
	if (mode !== '->') { // <- or <->
		target.onvalue.add(function(value) {
			_this.sync(source, value, targetConversion);
		});
	}
};

nx.Binding.prototype.sync = function(recipient, value, conversion) {
	if (this.mode === '<->') {
		if (this.locked) {
			this.locked = false;
			return;
		} else {
			this.locked = true;
		}
	}
	if (typeof conversion !== 'undefined') {
		if (conversion instanceof nx.Mapping) {
			value = conversion.map(value, recipient.value);
		} else if (typeof conversion === 'function') {
			value = conversion(value);
		}
	} else {
		value = value;
	}
	recipient.value = value;
	recipient.onsync.trigger(value);
};

window.nx = window.nx || {};

nx.Cell = function(options) {
	options = options || {};

	if (typeof options.value !== 'undefined') {
		this._value = options.value;
	}

	this.onvalue = new nx.Event();
	this.onsync = new nx.Event();
};

Object.defineProperty(nx.Cell.prototype, 'value', {
	enumerable : true,
	get: function() { return this._value; },
	set: function(value) {
		this._value = value;
		this.onvalue.trigger(value);
	}
});

nx.Cell.prototype.bind = function(target, mode, sourceConversion, targetConversion) {
	var binding = new nx.Binding(
		this,
		target,
		mode,
		sourceConversion,
		targetConversion
	);
	if (mode === '<-') {
		binding.sync(this, target.value, sourceConversion);
	} else {
		binding.sync(target, this.value, sourceConversion);
	}
	return binding;
};

nx.Cell.prototype.set = function(value) {
	this._value = value;
};

window.nx = window.nx || {};

nx.Collection = function (options) {
	options = options || {};

	if (typeof options.items !== 'undefined') {
		this.items = options.items;
	} else {
		this.items = [];
	}

	this.onappend = new nx.Event();
	this.onremove = new nx.Event();
	this.oninsertbefore = new nx.Event();
	this.onreset = new nx.Event();

	this.cell = new nx.Cell({ value: this.items });
	var _this = this;
	this.cell.onsync.add(function(items) {
		_this.items = items;
		_this.onreset.trigger({ items:items });
	});
};

nx.Collection.prototype.append = function() {
	var args = [].slice.call(arguments);
	var _this = this;
	args.forEach(function(item) {
		_this.items.push(item);
	});
	this.onappend.trigger({items: args});
	this.cell.value = this.items;
};

nx.Collection.prototype.remove = function() {
	var _slice = [].slice;
	var args = _slice.call(arguments);
	var indexes = [];

	this.items = this.items.filter(function(item, index) {
		var argIndex = args.indexOf(item);
		if (argIndex !== -1) {
			indexes.push(index);
			args.splice(argIndex, 1);
			return false;
		}
		return true;
	});
	this.onremove.trigger({items: _slice.call(arguments), indexes: indexes});
	this.cell.value = this.items;
};

nx.Collection.prototype.insertBefore = function(beforeItem, items) {
	items = Array.isArray(items) ? items : [items];
	var insertIndex = this.items.indexOf(beforeItem);
	[].splice.apply(this.items, [insertIndex, 0].concat(items));
	this.oninsertbefore.trigger({items: items, index: insertIndex});
	this.cell.value = this.items;
};

nx.Collection.prototype.removeAll = function() {
	this.items = [];
	this.onreset.trigger({items:[]});
	this.cell.value = this.items;
};

nx.Collection.prototype.set = function(array) {
	this.items = array;
	this.onreset.trigger({items:array});
	this.cell.value = this.items;
};

nx.Collection.prototype.bind = function(cell, mode, converter) {
	return this.cell.bind(cell, mode, converter);
};

window.nx = window.nx || {};

nx.Event = function() {
	this.handlers = {};
	this._nameIndex = 0;
};

nx.Event.prototype.trigger = function(argument) {
	for (var name in this.handlers) {
		this.handlers[name].call(null, argument);
	}
};

nx.Event.prototype.add = function(handler, name) {
	name = name || this._nameIndex++;
	this.handlers[name] = handler;
	return name;
};

nx.Event.prototype.remove = function(name) {
	delete this.handlers[name];
};

window.nx = window.nx || {};

nx.Mapping = function(pattern) {
	this.pattern = pattern;
};

nx.Mapping.prototype.map = function(source, target) {
	if (typeof this.pattern !== 'undefined') {
		for (var item in this.pattern) {
			if (item === '_' && typeof target !== 'undefined') {
				target[this.pattern[item]] = source;
			} else if (this.pattern[item] === '_' && typeof source !== 'undefined') {
				return target = source[item];
			} else if (typeof source !== 'undefined' && typeof target !== 'undefined') {
				target[this.pattern[item]] = source[item];
			}
		}
		return target;
	} else {
		return target = source;
	}
};

nx.Mapping.prototype.inverse = function() {
	var inversePattern = {};
	for (var item in this.pattern) {
		inversePattern[this.pattern[item]] = item;
	}
	return new nx.Mapping(inversePattern);
};

window.nx = window.nx || {};
window.nx.Utils = window.nx.Utils || {};

nx.Utils.interpolateString = function(string, props) {
	var matches = string.match(/[^{\}]+(?=\})/g);
	if (matches) {
		matches.forEach(function(match) {
			string = string.replace('{'+match+'}', props[match]);
		});
	}
	return string;
};

window.nxt = window.nxt || {};

nxt.ContentManager = function(element) {
	this.element = element;
	this.renderers = {};
	this.regions = [];
};

nxt.ContentManager.prototype.render = function() {
	var args = [].slice.call(arguments);
	var _this = this;
	var newRegion;
	var dynamicItems = [];
	this.content = [];
	args.forEach(function(item, index) {
		if (item !== undefined) {
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

window.nxt = window.nxt || {};

nxt.ContentRegion = function(element) {
	this.element = element;
	this.items = [];
	this.visibility = [];
};

nxt.ContentRegion.prototype.add = function(item) {
	var id = this.items.length;
	var _this = this;
	this.items.push(item);
	if (typeof this.insertReference !== 'undefined') {
		item.insertReference = this.insertReference;
	}
	item.visible.onvalue.add(function(visible) {
		var wasVisible = _this.visibility[id];
		if (visible && !wasVisible) {
			_this.update(id, true);
		} else if (!visible && wasVisible) {
			_this.update(id, false);
		}
	});
};

nxt.ContentRegion.prototype.update = function(id, visible) {
	this.visibility[id] = visible;
	var insertReference;
	if (visible) {
		insertReference = Array.isArray(this.items[id].content) ? this.items[id].content[0] : this.items[id].content; // item's content will serve as an insert reference
	} else if (this.items[id].insertReference) {
		insertReference = this.items[id].insertReference; // item's right visible neighbor will serve as an insert reference
	} else {
		insertReference = this.insertReference; // a static element adjacent to the region (if any) will serve as an insert reference
	}
	for (var index = id-1; index >= 0; index--) {
		this.items[index].insertReference = insertReference;
		if (this.visibility[index]) { break; }
	}
};

window.nxt = window.nxt || {};

nxt.Attr = function(name, value) {
	return (typeof name === 'string') ?
		{
			name: name,
			value: typeof value === 'undefined' ? '' : value,
			type: 'Attr'
		}
		: {
			items: name,
			type: 'Attr'
		};
};

nxt.Class = function(name, set) {
	return {
		name: name,
		set: set,
		type: 'Class'
	};
};

nxt.Text = function(text) {
	if (typeof text === 'undefined') {
		return undefined;
	}
	return {
		text: text,
		node: document.createTextNode(text),
		type: 'Node'
	};
};

nxt.Event = function(name, handler) {
	return {
		name: name,
		handler: handler,
		type: 'Event'
	};
};

nxt.Element = function() {
	var args = [].slice.call(arguments);
	args = args.reduce(function(acc, item) {
		return acc.concat(item);
	}, []);
	var name = args[0];
	var node = document.createElement(name);
	if (args.length > 1) {
		var content = args.slice(1);
		var contentManager = new nxt.ContentManager(node);
		nxt.ContentManager.prototype.render.apply(contentManager, content);
	}
	return {
		name: name,
		node: node,
		type: 'Node'
	};
};

nxt.Binding = function(cell, conversion, mode) {
	return {
		cell: cell,
		conversion: conversion,
		mode: mode || '->',
		type: 'Binding',
		dynamic: true
	};
};

nxt.DelegatedEvent = function(name, handlers) {
	return {
		name: name,
		handlers: handlers,
		type: 'DelegatedEvent'
	};
};

nxt.Collection = function () {
	var collection = arguments[0];
	var conversion = arguments[1];
	var events = [].slice.call(arguments, 2);
	return {
		collection: collection,
		conversion: conversion,
		events: events,
		type: 'Collection',
		dynamic: true
	};
};

window.nxt = window.nxt || {};

nxt.AttrRenderer = function(element) {
	this.element = element;
};

nxt.AttrRenderer.prototype.render = function(attr) {
	if (typeof attr.items !== 'undefined') {
		for (var key in attr.items) {
			this.element.setAttribute(key, attr.items[key]);
		}
	} else {
		this.element.setAttribute(attr.name, attr.value);
	}
};

window.nxt = window.nxt || {};

nxt.BindingRenderer = function(element) {
	var _this = this;
	this.element = element;

	this.cell = new nx.Cell();
	this.cell.onvalue.add(function(data) {
		if (typeof data !== 'undefined') {
			if (!_this.contentRenderer || !_this.contentRenderer instanceof nxt[data.type+'Renderer']) {
				_this.contentRenderer = new nxt[data.type+'Renderer'](_this.element);
			}
		}
		if (typeof _this.contentRenderer !== 'undefined') {
			_this.contentRenderer.insertReference = _this.insertReference;
			_this.contentRenderer.render(data);
			_this.content = _this.contentRenderer.content;
		}
	});

	this.visible = new nx.Cell();
	this.visible.bind(this.cell, '<-', function(value) {
		return typeof value !== 'undefined';
	});
};

nxt.BindingRenderer.prototype.render = function(binding) {
	this.binding = binding.cell.bind(this.cell, binding.mode, binding.conversion);
};

window.nxt = window.nxt || {};

nxt.ClassRenderer = function(element) {
	this.element = element;
};

nxt.ClassRenderer.prototype.render = function(classObj) {
	if (classObj.set) {
		this.element.classList.add(classObj.name);
	} else {
		this.element.classList.remove(classObj.name);
	}
};

window.nxt = window.nxt || {};

nxt.CollectionRenderer = function(element) {
	var _this = this;
	this.element = element;
	this.content = [];
	this.visible = new nx.Cell();
};

nxt.CollectionRenderer.prototype.render = function(data) {
	var _this = this;
	this.collection = data.collection;
	this.conversion = data.conversion;
	this.collection.onappend.add(function(evt){	_this.append(evt); });
	this.collection.oninsertbefore.add(function(evt){ _this.insertBefore(evt); });
	this.collection.onremove.add(function(evt){	_this.remove(evt); });
	this.collection.onreset.add(function(evt){ _this.reset(evt); });

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

nxt.CollectionRenderer.prototype.append = function(evt) {
	var convItems = evt.items.map(this.conversion);
	var manager = new nxt.ContentManager(this.element);
	nxt.ContentManager.prototype.render.apply(manager, convItems);
	this.content = this.content.concat(manager.content);
	this.visible.value = this.content.length > 0;
};

nxt.CollectionRenderer.prototype.insertBefore = function(evt) {
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

nxt.CollectionRenderer.prototype.remove = function(evt) {
	var _this = this;
	evt.indexes.forEach(function(index){
		_this.element.removeChild(_this.element.childNodes[index]);
		_this.content.splice(index, 1);
	});
	this.visible.value = this.content.length > 0;
};

nxt.CollectionRenderer.prototype.reset = function(evt) {
	for (var itemIndex = 0; itemIndex < this.content.length; itemIndex++) {
		this.element.removeChild(this.content[itemIndex]);
	}
	this.content = [];
	this.append(evt);
};

window.nxt = window.nxt || {};

nxt.EventRenderer = function(element) {
	this.element = element;
};

nxt.EventRenderer.prototype.render = function(event) {
	this.element.addEventListener(event.name, event.handler);
};
window.nxt = window.nxt || {};

nxt.NodeRenderer = function(element) {
	this.element = element;
	this.replace = true;
};

nxt.NodeRenderer.prototype.render = function(element) {
	if (typeof element !== 'undefined') {
		if (typeof this.insertReference !== 'undefined') {
			this.element.insertBefore(element.node, this.insertReference);
		} else {
			if (typeof this.content !== 'undefined' && this.replace) {
				this.element.replaceChild(element.node, this.content);
			} else {
				this.element.appendChild(element.node);
			}
		}
		this.content = element.node;
	} else {
		this.element.removeChild(this.content);
		this.content = undefined;
	}

	return this.content;
};

window.nx = window.nx || {};

nx.RestCollection = function(options) {
	nx.AjaxModel.call(this, options);
	this.options = options;
	this.items = new nx.Collection();
};

nx.RestCollection.prototype = Object.create(nx.AjaxModel.prototype);
nx.RestCollection.prototype.constructor = nx.RestCollection;

nx.RestCollection.prototype.create = function(doc, done) {
	this.request({
		url: this.options.url,
		method: 'post',
		data: doc.data.value,
		success: function(response) {
			doc.data.value = response;
			if (typeof done === 'function') {
				done.call(null, response);
			}
		}
	});
};

nx.RestCollection.prototype.retrieve = function(done) {
	var _this = this;
	this.request({
		url: this.options.url,
		method: 'get',
		success: function(items) {
			_this.items.set(items.map(function(item) {
				var doc = new _this.options.item({ data: item, url: _this.options.url });
				return doc;
			}));
			if (typeof done === 'function') {
				done.call(null, _this.items);
			}
		}
	});
};

window.nx = window.nx || {};

nx.RestDocument = function(options) {
	nx.AjaxModel.call(this, options);
	this.options = options;
};

nx.RestDocument.prototype = Object.create(nx.AjaxModel.prototype);
nx.RestDocument.prototype.constructor = nx.RestDocument;

nx.RestDocument.prototype.retrieve = function(done) {
	var _this = this;
	this.request({
		url: this.options.url,
		method: 'get',
		success: function(data) {
			_this.data.value = data;
			if (typeof done === 'function') {
				done.call(null, data);
			}
		}
	});
};

nx.RestDocument.prototype.save = function(done) {
	var _this = this;
	this.request({
		url: this.options.url,
		data: this.data.value,
		method: 'put',
		success: function(data) {
			_this.data.value = data;
			if (typeof done === 'function') {
				done.call(null, data);
			}
		}
	});
};

nx.RestDocument.prototype.remove = function(done) {
	var _this = this;
	this.request({
		url: this.options.url,
		data: this.data.value, // for url interpolation
		method: 'delete',
		success: function(data) {
			if (typeof done === 'function') {
				done.call(null, data);
			}
		}
	});
};

})();
