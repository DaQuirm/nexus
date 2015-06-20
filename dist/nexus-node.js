/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
		nx: {
			/* Core */
			Binding:    __webpack_require__(3),
			Cell:       __webpack_require__(2),
			Collection: __webpack_require__(7),
			Mapping:    __webpack_require__(4)
		}
	};


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var nx = {
		Binding: __webpack_require__(3),
		Event:   __webpack_require__(5),
		Mapping: __webpack_require__(4)
	};
	
	nx.Cell = function (options) {
		options = options || {};
	
		if (typeof options.value !== 'undefined') {
			this._value = options.value;
		}
	
		this._bindingIndex = 0;
		this.bindings = {};
	
		this.onvalue = new nx.Event();
	
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
	
	nx.Cell.prototype['<-'] = function (arg, conversion, sync) {
		var values;
		var _this = this;
		if (Array.isArray(arg)) {
			values = new Array(arg.length);
			return arg.map(function (cell, index) {
				values[index] = cell.value;
				return cell['->'](_this, function (value) {
					values[index] = value;
					return conversion.apply(null, values);
				}, sync);
			});
		}
		return arg['->'](this, conversion, sync);
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
	
	nx.Cell.prototype.bind = function (cell, mode, conversion, backConversion) {
		this[mode](cell, conversion, backConversion);
	};
	
	nx.Cell.prototype.set = function (value) {
		this._value = value;
	};
	
	module.exports = nx.Cell;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var nx = {
		Mapping: __webpack_require__(4)
	};
	
	nx.Binding = function (source, target, conversion) {
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
	};
	
	nx.Binding.prototype.pair = function (binding) {
		this.lock = binding.lock = { locked: false };
		return this.lock;
	};
	
	nx.Binding.prototype.unbind = function () {
		delete this.source.bindings[this.index];
	};
	
	module.exports = nx.Binding;


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	var nx = {};
	
	nx.Mapping = function (pattern) {
		this.pattern = pattern;
	};
	
	nx.Mapping.prototype.map = function (source, target) {
		if (typeof this.pattern !== 'undefined') {
			for (var item in this.pattern) {
				if (item === '_' && typeof target !== 'undefined') {
					target[this.pattern[item]] = source;
				} else if (this.pattern[item] === '_' && typeof source !== 'undefined') {
					target = source[item];
					return target;
				} else if (typeof source !== 'undefined' && typeof target !== 'undefined') {
					target[this.pattern[item]] = source[item];
				}
			}
			return target;
		} else {
			target = source;
			return target;
		}
	};
	
	nx.Mapping.prototype.inverse = function () {
		var inversePattern = {};
		for (var item in this.pattern) {
			inversePattern[this.pattern[item]] = item;
		}
		return new nx.Mapping(inversePattern);
	};
	
	module.exports = nx.Mapping;


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	var nx = {};
	
	nx.Event = function () {
		this.handlers = {};
		this._nameIndex = 0;
	};
	
	nx.Event.prototype.trigger = function (argument) {
		for (var name in this.handlers) {
			this.handlers[name].call(null, argument);
		}
	};
	
	nx.Event.prototype.add = function (handler, name) {
		name = name || this._nameIndex++;
		this.handlers[name] = handler;
		return name;
	};
	
	nx.Event.prototype.remove = function (name) {
		delete this.handlers[name];
	};
	
	module.exports = nx.Event;


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	var nx = {};
	
	nx.Utils = {
	
		interpolateString: function (string, props) {
			var matches = string.match(/[^{\}]+(?=\})/g);
			if (matches) {
				matches.forEach(function (match) {
					string = string.replace('{' + match + '}', props[match]);
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
	
	module.exports = nx.Utils;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var nx = {
		ArrayTransform: __webpack_require__(8),
		Cell: __webpack_require__(2),
		Utils: __webpack_require__(6)
	};
	
	var nxt = {
		Command: __webpack_require__(9)
	};
	
	nx.Collection = function (options) {
		options = options || {};
		nx.Cell.call(this);
	
		var _this = this;
	
		this.value = options.items || [];
	
		this.command = new nx.Cell();
		this['<->'](
			this.command,
			function (items) {
				return new nxt.Command('Content', 'reset', { items: items });
			},
			function (command) {
				return nx.ArrayTransform(_this.items, command);
			}
		);
	
		this.length = new nx.Cell({ value: this.items.length });
		this.length['<-'](this, function (items) { return items.length; });
	};
	
	nx.Utils.mixin(nx.Collection.prototype, nx.Cell.prototype);
	nx.Collection.prototype.constructor = nx.Collection;
	
	Object.defineProperty(nx.Collection.prototype, 'items', {
		enumerable : true,
		get: function () { return this.value; },
		set: function (items) {
			this.value = items;
		}
	});
	
	nx.Collection.prototype.append = function () {
		var args = [].slice.call(arguments);
		this.command.value = new nxt.Command('Content', 'append', { items: args });
	};
	
	nx.Collection.prototype.remove = function () {
		var args = [].slice.call(arguments);
		var _this = this;
		var indexes = args.map(function (item) {
			return _this.items.indexOf(item);
		});
		this.command.value = new nxt.Command('Content', 'remove', { indexes: indexes });
	};
	
	nx.Collection.prototype.insertBefore = function (beforeItem, items) {
		items = Array.isArray(items) ? items : [items];
		var insertIndex = this.items.indexOf(beforeItem);
		this.command.value = new nxt.Command('Content', 'insertBefore', {
			items: items,
			index: insertIndex
		});
	};
	
	nx.Collection.prototype.reset = function (items) {
		this.command.value = new nxt.Command('Content', 'reset', { items: items || [] });
	};
	
	nx.Collection.prototype.swap = function (firstItem, secondItem) {
		var firstIndex = this.items.indexOf(firstItem);
		var secondIndex = this.items.indexOf(secondItem);
		this.command.value = new nxt.Command('Content', 'swap', {
			indexes: [firstIndex, secondIndex]
		});
	};
	
	module.exports = nx.Collection;


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	var nx = {};
	
	nx.ArrayTransform = function (array, command) {
		return nx.ArrayTransform[command.method](array, command.data);
	};
	
	// transformations are applied "in place" to create fewer objects
	// which doesn't affect the cell value updating mechanism and data flow
	
	nx.ArrayTransform.append = function (array, data) {
		[].push.apply(array, data.items);
		return array;
	};
	
	nx.ArrayTransform.remove = function (array, data) {
		data.indexes.forEach(function (index, count) {
			array.splice(index - count, 1);
		});
		return array;
	};
	
	nx.ArrayTransform.insertBefore = function (array, data) {
		[].splice.apply(array, [data.index, 0].concat(data.items));
		return array;
	};
	
	nx.ArrayTransform.reset = function (array, data) {
		return data.items;
	};
	
	nx.ArrayTransform.swap = function (array, data) {
		var temp = array[data.indexes[0]];
		array[data.indexes[0]] = array[data.indexes[1]];
		array[data.indexes[1]] = temp;
		return array;
	};
	
	module.exports = nx.ArrayTransform;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var nxt = __webpack_require__(10);
	
	nxt.Command = function (type, method, data) {
		this.type = type;
		this.method = method;
		this.data = data;
	};
	
	nxt.Command.prototype.run = function () {
		this.renderer = nxt[this.type + 'Renderer'];
		return this.renderer[this.method].apply(
			this.renderer,
			[this.data].concat([].slice.apply(arguments))
		);
	};
	
	module.exports = nxt.Command;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
		AttrRenderer:  __webpack_require__(11),
		ClassRenderer: __webpack_require__(12),
		EventRenderer: __webpack_require__(13),
		NodeRenderer:  __webpack_require__(14),
		StyleRenderer: __webpack_require__(15)
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	var nxt = {};
	
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
	
	module.exports = nxt.AttrRenderer;


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	var nxt = {};
	
	nxt.ClassRenderer = {
	
		render: function (data, domContext) {
			domContext.container.classList.add(data.name);
			return data.name;
		},
	
		unrender: function (domContext) {
			domContext.container.classList.remove(domContext.content);
		}
	
	};
	
	module.exports = nxt.ClassRenderer;


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	var nxt = {};
	
	nxt.EventRenderer = {
	
		add: function (data, domContext) {
			domContext.container.addEventListener(data.name, data.handler);
			return data;
		},
	
		unrender: function (domContext) {
			domContext.container.removeEventListener(domContext.content.name, domContext.content.handler);
		}
	
	};
	
	module.exports = nxt.EventRenderer;


/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	var nxt = {};
	
	nxt.NodeRenderer = {
	
		render: function (data, domContext) {
			if (typeof domContext.content !== 'undefined') {
				domContext.container.replaceChild(data.node, domContext.content);
			} else if (typeof domContext.insertReference !== 'undefined') {
				domContext.container.insertBefore(data.node, domContext.insertReference);
			} else {
				domContext.container.appendChild(data.node);
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
	
	module.exports = nxt.NodeRenderer;


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	var nxt = {};
	
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
	
	module.exports = nxt.StyleRenderer;


/***/ }
/******/ ]);
//# sourceMappingURL=nexus-node.js.map