(function() {
	'use strict';

/* since utils comes first in the build, create namespaces here */
window.nx = {};
window.nxt = {};

window.nx.Utils = {

	interpolateString: function (string, props) {
		var matches = string.match(/[^{\}]+(?=\})/g);
		if (matches) {
			matches.forEach(function(match) {
				string = string.replace('{'+match+'}', props[match]);
			});
		}
		return string;
	},

	mixin: function (target, source) {
		var keys = Object.getOwnPropertyNames(source);
		keys.forEach(function (key) {
			var desc = Object.getOwnPropertyDescriptor(source, key);
			Object.defineProperty(target, key, desc);
		});
	}

};

nx.AsyncStatus = {
	LOADING: 1,
	DONE: 2,
	ERROR: 3
};

nx.AjaxModel = function(options) {
	options = options || {};

	this.data = new nx.Cell();
	this.error = new nx.Cell();
	this.status = new nx.Cell();

	if (typeof options.data !== 'undefined') {
		this.data.value = options.data;
	}
};

nx.AjaxModel.prototype.request = function(options) {
	var _this = this;
	var url = nx.Utils.interpolateString(options.url, this.data.value);
	this.xhr = new XMLHttpRequest();
	this.xhr.open(options.method, url, true);
	this.xhr.responseType = (!window.chrome) ? 'json' : 'text';

	this.xhr.onload = function (evt) {
		var handler, data;

		if (this.responseType === "json") {
			data = this.response;
		} else if (this.responseText) {
			data = JSON.parse(this.responseText);
		}

		if (this.status === 200 || this.status === 201 || this.status === 204) {
			handler = options.success;
			_this.data.value = data;
			_this.status.value = nx.AsyncStatus.DONE;
		} else {
			handler = options.error;
			_this.error.value = data;
			_this.status.value = nx.AsyncStatus.ERROR;
		}

		if (typeof handler === 'function') {
			handler(data);
		}
	};

	if (options.method === 'post' || options.method === 'put') {
		this.xhr.setRequestHeader('Content-Type', 'application/json');
		this.xhr.send(JSON.stringify(this.data.value));
	} else {
		this.xhr.send();
	}
	_this.status.value = nx.AsyncStatus.LOADING;
};

nx.Binding = function (source, target, conversion) {
	var _this = this;

	this.source = source;
	this.target = target;

	this.conversion = conversion;
};

nx.Binding.prototype.sync = function () {
	if (typeof this.lock !== 'undefined') {
		if (this.lock.locked) {
			this.lock.locked = false;
			return;
		} else {
			this.lock.locked = true;
		}
	}

	var value = this.source.value;
	if (typeof this.conversion !== 'undefined') {
		if (this.conversion instanceof nx.Mapping) {
			value = this.conversion.map(value, this.target.value);
		} else if (typeof this.conversion === 'function') {
			value = this.conversion(value);
		}
	}
	this.target.value = value;
	this.target.onsync.trigger(value);
};

nx.Binding.prototype.pair = function (binding) {
	return this.lock = binding.lock = { locked: false };
};

nx.Binding.prototype.unbind = function () {
	delete this.source.bindings[this.index];
};

nx.Cell = function(options) {
	options = options || {};

	if (typeof options.value !== 'undefined') {
		this._value = options.value;
	}

	this._bindingIndex = 0;
	this.bindings = {};

	this.onvalue = new nx.Event();
	this.onsync = new nx.Event();

	if (typeof options.action !== 'undefined') {
		this.onvalue.add(options.action);
	}
};

Object.defineProperty(nx.Cell.prototype, 'value', {
	enumerable : true,
	get: function () { return this._value; },
	set: function (value) {
		this._value = value;
		this.onvalue.trigger(value);
		for (var index in this.bindings) {
			this.bindings[index].sync();
		}
	}
});

nx.Cell.prototype._createBinding = function (cell, conversion) {
	var binding = new nx.Binding(this, cell, conversion);
	binding.index = this._bindingIndex;
	this.bindings[this._bindingIndex++] = binding;
	return binding;
};

nx.Cell.prototype['->'] = function (cell, conversion, sync) {
	var binding = this._createBinding(cell, conversion);
	if (sync) {
		binding.sync();
	}
	return binding;
};

nx.Cell.prototype['<-'] = function (cell, conversion, sync) {
	var values;
	var _this = this;
	if (Array.isArray(cell)) {
		values = new Array(cell.length);
		return cell.map(function (cell, index) {
			values[index] = cell.value;
			return cell['->'](_this, function(value) {
				values[index] = value;
				return conversion.apply(null, values);
			}, sync);
		});
	}
	return cell['->'](this, conversion, sync);
};

nx.Cell.prototype['->>'] = function (cell, conversion) {
	return this['->'](cell, conversion, true);
};

nx.Cell.prototype['<<-'] = function (cell, conversion) {
	return this['<-'](cell, conversion, true);
};

nx.Cell.prototype['<->'] = function (cell, conversion, backConversion) {
	if (conversion instanceof nx.Mapping) {
		backConversion = backConversion || conversion.inverse();
	}
	var binding = this._createBinding(cell, conversion);
	var backBinding = cell._createBinding(this, backConversion);
	binding.pair(backBinding);
	binding.sync();
	return [binding, backBinding];
};

nx.Cell.prototype.bind = function(cell, mode, conversion, backConversion) {
	this[mode](cell, conversion, backConversion);
};

nx.Cell.prototype.set = function(value) {
	this._value = value;
};

nx.Collection = function (options) {
	options = options || {};
	nx.Cell.call(this);

	var _this = this;
	this.event = new nx.Cell();
	this.items = options.items || [];
	this.onsync.add(function (items) {
		_this.event.value = new nxt.Command('Content', 'reset', { items: items });
	});

	this.length = new nx.Cell({ value: this.items.length });
	this.length['<-'](this, function (items) { return items.length; });
};

nx.Utils.mixin(nx.Collection.prototype, nx.Cell.prototype);
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

nx.Collection.prototype.reset = function(items) {
	this.items = items || [];
};

nx.Collection.prototype.swap = function(firstItem, secondItem) {
	var firstIndex = this.items.indexOf(firstItem);
	var secondIndex = this.items.indexOf(secondItem);
	this.items[firstIndex] = secondItem;
	this.items[secondIndex] = firstItem;
	this.event.value = new nxt.Command('Content', 'swap', {
		indexes: [firstIndex, secondIndex]
	});
};

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

nx.Mapping = function (pattern) {
	this.pattern = pattern;
};

nx.Mapping.prototype.map = function (source, target) {
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

nx.Mapping.prototype.inverse = function () {
	var inversePattern = {};
	for (var item in this.pattern) {
		inversePattern[this.pattern[item]] = item;
	}
	return new nx.Mapping(inversePattern);
};

nxt.CommandBinding = function(source, target, conversion) {
	nx.Binding.call(this, source, target, conversion);
	this.index = source._bindingIndex;
	source.bindings[source._bindingIndex++] = this;
};

nx.Utils.mixin(nxt.CommandBinding.prototype, nx.Binding.prototype);

nxt.CommandBinding.prototype.sync = function () {
	nxt.CommandCellModel.enter(this.target);
	nx.Binding.prototype.sync.call(this);
	nxt.CommandCellModel.exit();
};


nxt.CommandCellModel = {

	cellStack: [],

	enter: function (cell) {
		var queue = [cell];

		if (cell.cleanup) {
			while (queue.length > 0) {
				var item = queue.shift();
				for (var index = 0; index < item.children.length; index++) {
					item.children[index].unbind();
					queue.push(item.children[index]);
				}
			}
			cell.children = [];
		}

		if (this.cellStack.length > 0) {
			var stackTop = this.cellStack[this.cellStack.length - 1];
			stackTop.children.push(cell);
		}

		this.cellStack.push(cell);
	},

	exit: function () {
		this.cellStack.pop();
	}

};

nxt.CommandCell = function(options) {
	options = options || { cleanup: true };
	nx.Cell.call(this, options);
	this.cleanup = options.cleanup;
	this.children = [];
};

nx.Utils.mixin(nxt.CommandCell.prototype, nx.Cell.prototype);

nxt.CommandCell.prototype.reverseBind = function (cell, conversion) {
	this._binding = new nxt.CommandBinding(cell, this, conversion);
	this._binding.sync();
	return this._binding;
};

nxt.CommandCell.prototype.unbind = function () {
	if (typeof this._binding !== 'undefined') {
		this._binding.unbind();
	}
};

nxt.Command = function(type, method, data) {
    this.type = type;
    this.method = method;
    this.data = data;
};

nxt.Command.prototype.run = function() {
	this.renderer = nxt[this.type + 'Renderer'];
	return this.renderer[this.method].apply(
		this.renderer,
		[this.data].concat([].slice.apply(arguments))
	);
};

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

	commandCell.bind(cell, '->>', new nx.Mapping({ '_': 'command' }));
	this.cells.push(cell);
};

nxt.ContentRegion.prototype.update = function(state) {
	var hasRenderer = typeof state.renderer !== 'undefined';
	var noCommand = typeof state.command === 'undefined';
	var wasVisible = state.visible;
	if (hasRenderer) {
		if (noCommand) {
			state.domContext.content = state.renderer.unrender(state.domContext);
			state.visible = false;
			delete state.renderer;
		}
		else if (state.renderer !== nxt[state.command.type+'Renderer']) {
			state.domContext.content = state.renderer.unrender(state.domContext);
		}
	}
	if (!noCommand) {
		state.domContext.content = state.command.run(state.domContext);
		state.renderer = state.command.renderer;
		if (typeof state.renderer.visible === 'function') {
			state.visible = state.renderer.visible(state.domContext.content);
		} else {
			state.visible = nxt.NodeRenderer.visible(state.domContext.content);
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

nxt.ContentRenderer = {

	render: function (data, domContext) {
		var cells = [];
		var contentItems = [];
		var _this = this;

		data.items.forEach(function (command) {
			if (command !== undefined) {
				if (command instanceof nxt.Command) {
					var content = command.run(domContext);
					contentItems.push(content);
					if (cells.length > 0) { // dynamic content followed by static content
						var regionContext = { container: domContext.container };
						// only DOM-visible items can serve as an insert reference
						var renderer = nxt[command.type + 'Renderer'];
						if (nxt.NodeRenderer.visible(content)) {
							regionContext.insertReference = content;
						}
						_this.createRegion(regionContext, cells);
						cells = [];
					}
				} else { // command is really a cell
					cells.push(command);
				}
			}
		});

		if (cells.length > 0) {
			// no need for an insert reference as these cells' content is appended by default
			this.createRegion({ container: domContext.container, insertReference: domContext.insertReference }, cells);
		}
		return contentItems;
	},

	createRegion: function (domContext, cells) {
		var newRegion = new nxt.ContentRegion(domContext);
		for (var itemIndex = 0; itemIndex < cells.length; itemIndex++) {
			newRegion.add(cells[itemIndex]);
		}
		return newRegion;
	},

	append: function (data, domContext) {
		return (domContext.content || []).concat(
			this.render(data, {
				container: domContext.container,
				insertReference: domContext.insertReference
			})
		);
	},

	insertBefore: function (data, domContext) {
		var insertReference = domContext.content[data.index];
		var content = data.items.map(function (item) {
			return item.run({
				container: domContext.container,
				insertReference: insertReference
			});
		});
		[].splice.apply(
			domContext.content,
			[data.index, 0].concat(content)
		);
		return domContext.content;
	},

	remove: function (data, domContext) {
		data.indexes
			.sort(function (a,b) { return a - b; })
			.forEach(function (removeIndex, index) {
				domContext.container.removeChild(domContext.content[removeIndex - index]);
				domContext.content.splice(removeIndex - index, 1);
			});
		return domContext.content;
	},

	reset: function (data, domContext) {
		if (typeof domContext.content !== 'undefined') {
			for (var index = 0; index < domContext.content.length; index++) {
				domContext.container.removeChild(domContext.content[index]);
			}
			delete domContext.content;
		}
		return this.render(data, domContext);
	},

	swap: function (data, domContext) {
		data.indexes.sort(function (a,b) { return a - b; });
		var firstIndex = data.indexes[0];
		var secondIndex = data.indexes[1];
		var firstNode = domContext.content[firstIndex];
		var secondNode = domContext.content[secondIndex];
		var sibling = null;
		if (data.indexes[1] < domContext.content.length - 1) {
			sibling = domContext.content[secondIndex + 1];
		}
		domContext.container.insertBefore(secondNode, firstNode);
		domContext.container.insertBefore(firstNode, sibling);
		domContext.content[firstIndex] = secondNode;
		domContext.content[secondIndex] = firstNode;
		return domContext.content;
	},

	get: function (data, domContext) {
		data.next(domContext.content);
		return domContext.content;
	},

	visible: function (content) {
		return content.some(nxt.NodeRenderer.visible);
	}
};

nxt.Attr = function(name, value) {
	var data = (typeof name === 'string')
		? { name: name, value: typeof value === 'undefined' ? '' : value }
		: { items: name };
	return new nxt.Command('Attr', 'render', data);
};

nxt.Class = function(name) {
	return new nxt.Command('Class', 'render', { name: name });
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
		nxt.ContentRenderer.render({ items: content }, { container: node });
	}
	return new nxt.Command('Node', 'render', { node: node });
};

nxt.Binding = function(cell, conversion) {
	var commandCell = new nxt.CommandCell();
	commandCell.reverseBind(cell, conversion);
	return commandCell;
};

nxt.ItemEvent = function(name, handlers) {
	return { name: name, handlers: handlers };
};

nxt.Collection = function () {
	var collection = arguments[0];
	var conversion = arguments[1];
	var events = [].slice.call(arguments, 2);
	var commandCell = new nxt.CommandCell({ cleanup: false });
	collection.event.value = new nxt.Command('Content', 'reset', { items: collection.items });
	commandCell.reverseBind(collection.event, function(command) {
		if (typeof command !== 'undefined') {
			command.data.items = command.data.items.map(conversion);
		}
		return command;
	});
	var delegatedEvents;
	if (events.length > 0) {
		delegatedEvents = events.map(function(event) {
			return nxt.Event(event.name, function(evt) {
				var target = evt.target;
				var contentIndex, contentItem;
				collection.event.value = new nxt.Command('Content', 'get', {
					items: [], // so that collection's event cell converter doesn't complain
					next: function(content) {
						content.some(function(item, index) {
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
									collection.items[contentIndex]
								);
							}
						};
						while (!contentItem.isEqualNode(target)) {
							selectors.forEach(callMatchingHandlers);
							target = target.parentNode;
						}
						selectors.forEach(callMatchingHandlers);
					}
				});
			});
		});
		return [commandCell].concat(delegatedEvents);
	} else {
		return commandCell;
	}
};

nxt.ValueBinding = function (cell, conversion, backConversion) {
	var lock = { locked: false };
	var eventCommand = nxt.Event('input', function () {
		lock.locked = true;
		cell.value = backConversion ? backConversion(this.value) : this.value;
	});

	var commandCell = new nxt.CommandCell();
	var binding = commandCell.reverseBind(cell, function (value) {
		lock.locked = false; // for continuous binding sync, prevents alternate locking
		return nxt.Attr('value', conversion ? conversion(value) : value);
	});
	binding.lock = lock;

	return [eventCommand, commandCell];
};

nxt.Style = function (data) {
	return new nxt.Command('Style', 'render', data);
};

nxt.AttrRenderer = {

	render: function (data, domContext) {
		var attrMap = {};
		if (typeof data.items !== 'undefined') {
			for (var key in data.items) {
				if (key === 'value') {
					domContext.container.value = data.items[key];
				} else {
					domContext.container.setAttribute(key, data.items[key]);
				}
			}
			attrMap = data.items;
		} else {
			if (data.name === 'value') {
				domContext.container.value = data.value;
			}
			else {
				domContext.container.setAttribute(data.name, data.value);
			}
			attrMap[data.name] = data.value;
		}
		return attrMap;
	},

	unrender: function (domContext) {
		for (var key in domContext.content) {
			domContext.container.removeAttribute(key);
		}
	}
};

nxt.ClassRenderer = {

	render: function (data, domContext) {
		domContext.container.classList.add(data.name);
		return data.name;
	},

	unrender: function (domContext) {
		domContext.container.classList.remove(domContext.content);
	}

};

nxt.EventRenderer = {

	add: function (data, domContext) {
		domContext.container.addEventListener(data.name, data.handler);
		return data;
	},

	unrender: function (domContext) {
		domContext.container.removeEventListener(domContext.content.name, domContext.content.handler);
	}

};

nxt.NodeRenderer = {

	render: function (data, domContext) {
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
	},

	visible: function (content) {
		return typeof content !== 'undefined'
			&& (content.nodeType === Node.ELEMENT_NODE || content.nodeType === Node.TEXT_NODE);
	},

	unrender: function (domContext) {
		domContext.container.removeChild(domContext.content);
	}

};

nxt.StyleRenderer = {

	render: function (data, domContext) {
		for (var key in data) {
			domContext.container.style.setProperty(key, data[key]);
		}
		return data;
	},

	unrender: function (domContext) {
		for (var key in domContext.content) {
			domContext
				.container
				.style
				.removeProperty(key);
		}
	}
};

nx.RestCollection = function(options) {
	nx.Collection.call(this, options);
	nx.AjaxModel.call(this, options);
	this.options = options;

	var _this = this;
	this.bind(
		this.data,
		'<->',
		function (items) {
			return items.map(function (item) { return item.data.value; });
		},
		function (items) {
			return items.map(function (item) {
				return new _this.options.item(item);
			});
		}
	);
};

nx.Utils.mixin(nx.RestCollection.prototype, nx.Collection.prototype);
nx.Utils.mixin(nx.RestCollection.prototype, nx.AjaxModel.prototype);
nx.RestCollection.prototype.constructor = nx.RestCollection;

nx.RestCollection.prototype.request = function(options) {
	var _this = this;
	nx.AjaxModel.prototype.request.call(this, {
		url: this.options.url,
		method: options.method,
		success: function () {
			if (typeof options.success === 'function') {
				options.success(_this.items);
			}
		}
	});
};

nx.RestCollection.prototype.create = function(doc, done) {
	nx.RestDocument.prototype.request.call(doc, {
		url: this.options.url,
		method: 'post',
		success: done
	});
};

nx.RestCollection.prototype.retrieve = function(done) {
	this.request({ method: 'get', success: done });
};

nx.RestCollection.prototype.remove = function (doc, done) {
	var _this = this;
	doc.remove(function () {
		nx.Collection.prototype.remove.call(_this, doc);
		if (typeof done === 'function') {
			done();
		}
	});
};

nx.RestDocument = function(options) {
	nx.AjaxModel.call(this, options);
	this.options = options;
};

nx.Utils.mixin(nx.RestDocument.prototype, nx.AjaxModel.prototype);
nx.RestDocument.prototype.constructor = nx.RestDocument;

nx.RestDocument.prototype.request = function(options) {
	nx.AjaxModel.prototype.request.call(this, {
		url: options.url || this.options.url,
		method: options.method,
		success: options.success
	});
};

nx.RestDocument.prototype.retrieve = function(done) {
	this.request({ method: 'get', success: done	});
};

nx.RestDocument.prototype.save = function(done) {
	this.request({ method: 'put', success: done	});
};

nx.RestDocument.prototype.remove = function(done) {
	this.request({ method: 'delete', success: done });
};


})();
