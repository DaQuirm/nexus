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

	if (typeof options.action !== 'undefined') {
		this.onvalue.add(options.action);
	}
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
	nx.Cell.call(this);

	var _this = this;
	this.event = new nx.Cell();
	this.items = options.items || [];
	this.onsync.add(function (items) {
		_this.event.value = new nxt.Command('Content', 'reset', { items: items });
	});
};

nx.Collection.prototype = Object.create(nx.Cell.prototype);
nx.Collection.prototype.constructor = nx.Collection;

Object.defineProperty(nx.Collection.prototype, 'items', {
	enumerable : true,
	get: function() { return this.value; },
	set: function(items) {
		this.value = items;
		this.event.value = new nxt.Command('Content', 'reset', { items: items });
	}
});

nx.Collection.prototype.append = function() {
	var args = [].slice.call(arguments);
	this.value = this.value.concat(args);
	this.event.value = new nxt.Command('Content', 'append', { items: args });
};

nx.Collection.prototype.remove = function() {
	var _slice = [].slice;
	var args = _slice.call(arguments);
	var indexes = [];

	this.value = this.items.filter(function(item, index) {
		var argIndex = args.indexOf(item);
		if (argIndex !== -1) {
			indexes.push(index);
			args.splice(argIndex, 1);
			return false;
		}
		return true;
	});
	this.event.value = new nxt.Command('Content', 'remove', {
		items: _slice.call(arguments),
		indexes: indexes
	});
};

nx.Collection.prototype.insertBefore = function(beforeItem, items) {
	items = Array.isArray(items) ? items : [items];
	var insertIndex = this.items.indexOf(beforeItem);
	[].splice.apply(this.items, [insertIndex, 0].concat(items));
	this.event.value = new nxt.Command('Content', 'insertBefore', {
		items: items,
		index: insertIndex
	});
};

nx.Collection.prototype.removeAll = function() {
	this.items = [];
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

nxt.Command = function(type, method, data) {
    this.type = type;
    this.method = method;
    this.data = data;
};

nxt.Command.prototype.run = function() {
	this.renderer = new nxt[this.type + 'Renderer']();
	return this.renderer[this.method].apply(
		this.renderer,
		[this.data].concat([].slice.apply(arguments))
	);
};

window.nxt = window.nxt || {};

nxt.ContentRegion = function(domContext) {
	this.domContext = domContext;
	this.cells = [];
};

nxt.ContentRegion.prototype.add = function(commandCell) {
	var index = this.cells.length;
	var _this = this;
	var cell = new nx.Cell({
		value: {
			index: this.cells.length,
			// copying domContext, because its `content` and `renderer` fields
			// are different for each cell
			domContext: {
				container: this.domContext.container,
				insertReference: this.domContext.insertReference
			},
			visible: false
		},
		action: function(state) { _this.update(state); }
	});

	commandCell.bind(cell, '->', new nx.Mapping({ '_': 'command' }));
	this.cells.push(cell);
};

nxt.ContentRegion.prototype.update = function(state) {
	var hasRenderer = typeof state.renderer !== 'undefined';
	var noCommand = typeof state.command === 'undefined';
	if (hasRenderer) {
		if (noCommand) {
			state.domContext.content = state.renderer.unrender(state.domContext);
			state.visible = false;
		}
		else if (!(state.renderer instanceof nxt[state.command.type+'Renderer'])) {
			state.domContext.content = state.renderer.unrender(state.domContext);
		}
	}
	if (!noCommand) {
		state.domContext.content = state.command.run(state.domContext);
		state.renderer = state.command.renderer;
		if (typeof state.renderer.visible === 'function') {
			state.visible = state.renderer.visible(state.domContext.content);
		} else {
			state.visible = false;
		}
	}
	var insertReference;
	if (state.visible) {
		insertReference = Array.isArray(state.domContext.content)
			? state.domContext.content[0]
			: state.domContext.content; // cell's content will serve as an insert reference
	} else {
		insertReference = state.domContext.insertReference; // item's right visible neighbor will serve as an insert reference
	}
	for (var index = state.index - 1; index >= 0; index--) {
		this.cells[index].value.domContext.insertReference = insertReference;
		if (this.cells[index].value.visible) { break; }
	}
};

window.nxt = window.nxt || {};

nxt.ContentRenderer = function() {};

nxt.ContentRenderer.prototype.render = function(data, domContext) {
	this.regions = [];
	var cells = [];
	var contentItems = [];

	var _this = this;
	var createRegion = function(domContext, cells) {
		var newRegion = new nxt.ContentRegion(domContext);
		for (var itemIndex = 0; itemIndex < cells.length; itemIndex++) {
			newRegion.add(cells[itemIndex]);
		}
		_this.regions.push(newRegion);
	};

	data.items.forEach(function (command) {
		if (command !== undefined) {
			if (!(command instanceof nx.Cell)) {
				var content = command.run(domContext);
				contentItems.push(content);
				if (cells.length > 0) { // dynamic content followed by static content
					createRegion(
						{
							container: domContext.container,
							insertReference: content
						},
						cells
					);
					cells = [];
				}
			} else {
				cells.push(command);
			}
		}
	});

	if (cells.length > 0) {
		// no need for an insert reference as these cells' content is appended by default
		createRegion({ container: domContext.container }, cells);
	}
	return contentItems;
};

nxt.ContentRenderer.prototype.append = function(data, domContext) {
	return (domContext.content || []).concat(
		this.render(data, {
			container: domContext.container,
			insertReference: domContext.insertReference
		})
	);
};

nxt.ContentRenderer.prototype.insertBefore = function(data, domContext) {
	data.items.forEach(function (item, index) {
		var content = item.run({
			container: domContext.container,
			insertReference: domContext.content[data.insertIndex + index]
		});
		domContext.content.splice(data.insertIndex + index, 0, content);
	});
	return domContext.content;
};

nxt.ContentRenderer.prototype.remove = function(data, domContext) {
	data.indexes
		.sort(function (a,b) { return a - b; })
		.forEach(function (removeIndex, index) {
			domContext.container.removeChild(domContext.content[removeIndex - index]);
			domContext.content.splice(removeIndex - index, 1);
		});
	return domContext.content;
};

nxt.ContentRenderer.prototype.reset = function(data, domContext) {
	var firstChild;
	if (typeof domContext.content !== 'undefined') {
		for (var index = 0; index < domContext.content.length; index++) {
			domContext.container.removeChild(domContext.content[index]);
		}
		delete domContext.content;
	}
	return this.render(data, domContext);
};

nxt.ContentRenderer.prototype.visible = function(content) {
	return content.length > 0;
};

window.nxt = window.nxt || {};

nxt.Attr = function(name, value) {
	var data = (typeof name === 'string')
		? { name: name, value: typeof value === 'undefined' ? '' : value }
		: { items: name };
	return new nxt.Command('Attr', 'render', data);
};

nxt.Class = function(name, set) {
	if (typeof set === 'undefined') {
		set = true;
	}
	return set
		? new nxt.Command('Class', 'add', { name: name })
		: new nxt.Command('Class', 'remove', { name: name });
};

nxt.Text = function(text) {
	if (typeof text === 'undefined') {
		return undefined;
	}
	return new nxt.Command('Node', 'render', {
		node: document.createTextNode(text),
		text: text
	});
};

nxt.Event = function(name, handler) {
	return new nxt.Command('Event', 'add', { name: name, handler: handler });
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
		var contentRenderer = new nxt.ContentRenderer();
		contentRenderer.render({ items: content }, { container: node });
	}
	return new nxt.Command('Node', 'render', { node: node });
};

nxt.Binding = function(cell, conversion, mode) {
	var commandCell = new nx.Cell();
	cell.bind(commandCell, '->', conversion);
	return commandCell;
};

nxt.DelegatedEvent = function(name, handlers) {
	return new nxt.Command('DelegatedEvent', 'add', { name: name, handlers: handlers });
};

nxt.Collection = function () {
	var collection = arguments[0];
	var conversion = arguments[1];
	var events = [].slice.call(arguments, 2);
	var commandCell = new nx.Cell();
	collection.event.value = new nxt.Command('Content', 'reset', { items: collection.items });
	collection.event.bind(commandCell, '->', function(command) {
		if (typeof command !== 'undefined') {
			command.data.items = command.data.items.map(conversion);
		}
		return command;
	});
	return commandCell;
};

window.nxt = window.nxt || {};

nxt.AttrRenderer = function() {};

nxt.AttrRenderer.prototype.render = function(data, domContext) {
	if (typeof data.items !== 'undefined') {
		for (var key in data.items) {
			domContext.container.setAttribute(key, data.items[key]);
		}
	} else {
		domContext.container.setAttribute(data.name, data.value);
	}
};

window.nxt = window.nxt || {};

nxt.ClassRenderer = function() {};

nxt.ClassRenderer.prototype.add = function(data, domContext) {
	domContext.container.classList.add(data.name);
};

nxt.ClassRenderer.prototype.remove = function(data, domContext) {
	domContext.container.classList.remove(data.name);
};

window.nxt = window.nxt || {};

nxt.EventRenderer = function() {};

nxt.EventRenderer.prototype.add = function(data, domContext) {
	domContext.container.addEventListener(data.name, data.handler);
};

window.nxt = window.nxt || {};

nxt.NodeRenderer = function() {};

nxt.NodeRenderer.prototype.render = function(data, domContext) {
	if (typeof domContext.content !== 'undefined') {
		domContext.container.replaceChild(data.node, domContext.content);
	} else {
		if (typeof domContext.insertReference !== 'undefined') {
			domContext.container.insertBefore(data.node, domContext.insertReference);
		} else {
			domContext.container.appendChild(data.node);
		}
	}
	return data.node;
};

nxt.NodeRenderer.prototype.visible = function(content) {
	return typeof content !== 'undefined';
};

nxt.NodeRenderer.prototype.unrender = function(domContext) {
	domContext.container.removeChild(domContext.content);
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
			_this.items.items = items.map(function(item) {
				var doc = new _this.options.item({ data: item, url: _this.options.url });
				return doc;
			});
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
